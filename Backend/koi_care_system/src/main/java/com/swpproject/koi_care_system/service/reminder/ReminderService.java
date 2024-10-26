package com.swpproject.koi_care_system.service.reminder;

import com.swpproject.koi_care_system.dto.ReminderDto;
import com.swpproject.koi_care_system.enums.ErrorCode;
import com.swpproject.koi_care_system.exceptions.AppException;
import com.swpproject.koi_care_system.mapper.ReminderMapper;
import com.swpproject.koi_care_system.models.Reminder;
import com.swpproject.koi_care_system.models.User;
import com.swpproject.koi_care_system.payload.request.ReminderRequest;
import com.swpproject.koi_care_system.repository.ReminderRepository;
import com.swpproject.koi_care_system.repository.UserRepository;
import com.swpproject.koi_care_system.service.notification.INotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;

@EnableAsync
@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReminderService implements IReminderService {
    UserRepository userRepository;
    ReminderRepository reminderRepository;
    ReminderMapper reminderMapper;
    SimpMessagingTemplate messagingTemplate;
    INotificationService notificationService;
    SimpUserRegistry userRegistry;

    @Override
    public ReminderDto createReminder(ReminderRequest request, Principal connectedUser) {
        User user = userRepository.findByUsername(connectedUser.getName()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Reminder reminder = reminderMapper.mapToReminders(request);
        reminder.setUser(user);
        return reminderMapper.mapToReminderDto(reminderRepository.save(reminder));
    }

    @Override
    public ReminderDto updateReminder(Long id, ReminderRequest request) {
        Reminder reminder = reminderRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Reminder not found"));
        reminderMapper.updateReminderFromRequest(request, reminder);
        return reminderMapper.mapToReminderDto(reminderRepository.save(reminder));
    }

    @Override
    public void deleteReminder(Long id) {
        Reminder reminder = reminderRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Reminder not found"));
        reminderRepository.delete(reminder);
    }

    @Override
    public List<ReminderDto> getListReminder() {
        List<Reminder> reminders = reminderRepository.findAll();
        return reminders.stream().map(reminderMapper::mapToReminderDto).toList();
    }

    @Async
    @Scheduled(fixedRate = 60000)
    @Override// Check every minute
    public void checkReminders() {
        List<Reminder> reminders = reminderRepository.findAll();
        LocalDateTime now = LocalDateTime.now();
        log.info("Checking reminders at {}", now);
        reminders.forEach(reminder -> processReminder(reminder, now));
    }

    private void processReminder(Reminder reminder, LocalDateTime now) {
        switch (reminder.getRepeatInterval()) {
            case ONE_TIME:
                if (isReminderDue(reminder, now)) {
                    sendReminderNotification(reminder);
                }
                break;
            case DAILY:
                if (isTimeMatching(reminder.getDateTime(), now)) {
                    sendReminderNotification(reminder);
                }
                break;
            case WEEKLY:
                if (reminder.getDateTime().getDayOfWeek() == now.getDayOfWeek() && isTimeMatching(reminder.getDateTime(), now)) {
                    sendReminderNotification(reminder);
                }
                break;
        }
    }

    private boolean isReminderDue(Reminder reminder, LocalDateTime now) {
        return reminder.getDateTime().getHour() == now.getHour() &&
                reminder.getDateTime().getMinute() == now.getMinute();
    }

    private boolean isTimeMatching(LocalDateTime reminderTime, LocalDateTime now) {
        return reminderTime.getHour() == now.getHour() &&
                reminderTime.getMinute() == now.getMinute();
    }


    private void sendReminderNotification(Reminder reminder) {
        User user = reminder.getUser();
        String message = "Reminder: " + reminder.getTitle() + " is due at " + reminder.getDateTime() + "!";
        boolean isDelivered = false;
        if (isConnection(user)) {
            try {
                messagingTemplate.convertAndSendToUser(user.getUsername(), "/notifications", message);
                isDelivered = true;
            } catch (MessagingException e) {
                isDelivered = false;
            }
        }
        notificationService.createNotification(reminderMapper.mapToNotificationRequest(reminder, isDelivered));
        log.info("user connected: {}", isConnection(user));
        log.info("That user: {}", user.getUsername());
        log.info("Notification sent for reminder '{}'.", reminder.getTitle());
    }

    private boolean isConnection(User user) {
        return userRegistry.getUser(user.getUsername()) != null;
    }
    //TODO: store in database info that I missed the reminder
}

