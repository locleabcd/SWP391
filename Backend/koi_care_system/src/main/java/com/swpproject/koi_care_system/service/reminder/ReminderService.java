package com.swpproject.koi_care_system.service.reminder;

import com.swpproject.koi_care_system.dto.ReminderDto;
import com.swpproject.koi_care_system.enums.ErrorCode;
import com.swpproject.koi_care_system.exceptions.AppException;
import com.swpproject.koi_care_system.mapper.ReminderMapper;
import com.swpproject.koi_care_system.models.Reminder;
import com.swpproject.koi_care_system.models.ReminderMongo;
import com.swpproject.koi_care_system.models.User;
import com.swpproject.koi_care_system.payload.request.ReminderRequest;
import com.swpproject.koi_care_system.repository.ReminderMongoRepo;
import com.swpproject.koi_care_system.repository.ReminderRepository;
import com.swpproject.koi_care_system.repository.UserRepository;
import com.swpproject.koi_care_system.service.email.IEmailService;
import com.swpproject.koi_care_system.service.notification.INotificationService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

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
    ReminderMongoRepo reminderMongoRepo;
    IEmailService emailService;

    @Override
    public ReminderDto createReminder(ReminderRequest request, Principal connectedUser) {
        User user = userRepository.findByUsername(connectedUser.getName())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Reminder reminder = reminderMapper.mapToReminders(request);
        reminder.setUser(user);
        reminder = reminderRepository.save(reminder);

        ReminderMongo reminderMongo = reminderMapper.mapToReminderMongo(reminder);
        reminderMongoRepo.save(reminderMongo);
        log.info("Reminder created: {}", reminder.getDateTime());
        return reminderMapper.mapToReminderDto(reminder);
    }

    @Override
    public ReminderDto updateReminder(Long id, ReminderRequest request) {
        Reminder reminder = reminderRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Reminder not found"));
        reminderMapper.updateReminderFromRequest(reminder, request);
        reminder = reminderRepository.save(reminder);

        ReminderMongo reminderMongo = reminderMongoRepo.findById(id).orElse(null);
        if (reminderMongo != null) {
            reminderMapper.updateReminderMongo(reminderMongo, reminder);
            reminderMongoRepo.save(reminderMapper.mapToReminderMongo(reminder));
        }
        return reminderMapper.mapToReminderDto(reminder);
    }

    @Override
    public void deleteReminder(Long id) {
        Reminder reminder = reminderRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Reminder not found"));
        reminderRepository.delete(reminder);
        reminderMongoRepo.deleteById(id);
    }

    @Override
    public List<ReminderDto> getListReminder() {
        List<Reminder> reminders = reminderRepository.findAll();
        return reminders.stream().map(reminderMapper::mapToReminderDto).toList();
    }

    @Override
    public List<ReminderDto> getListReminderByUser(Principal connectedUser) {
        User user = userRepository.findByUsername(connectedUser.getName())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        List<Reminder> reminders = reminderRepository.findByUserId(user.getId());
        return reminders.stream().map(reminderMapper::mapToReminderDto).toList();
    }

    @Async
    @Scheduled(fixedRate = 60000)
    @Override
    public void checkReminders() {
        LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Ho_Chi_Minh"));
        LocalDateTime startTime = now.withSecond(0).withNano(0);

        String startDateTime = startTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm"));

        List<ReminderMongo> reminders = reminderMongoRepo.findDueRemindersBetween(startDateTime);
        log.info("Found {} reminders due at {}", reminders.size(), now);

        reminders.forEach(reminder -> {
            processReminder(reminder, now);
        });
    }

    private LocalDateTime convertToLocalDateTime(String dateTimeString) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");
        return LocalDateTime.parse(dateTimeString, formatter).atZone(ZoneId.of("Asia/Ho_Chi_Minh")).toLocalDateTime();
    }


    private void processReminder(ReminderMongo reminder, LocalDateTime now) {
        // Convert the stored string date to LocalDateTime
        LocalDateTime reminderTime = convertToLocalDateTime(reminder.getDateTime());
        log.info("PROCRSSREMINDER reminderTIME: {}", reminderTime);
        switch (reminder.getRepeatInterval()) {
            case ONE_TIME:
                if (isReminderDue(reminderTime, now)) {
                    sendReminderNotification(reminder);
                }
                break;
            case DAILY:
                if (isTimeMatching(reminderTime, now)) {
                    sendReminderNotification(reminder);
                }
                break;
            case WEEKLY:
                if (reminderTime.getDayOfWeek() == now.getDayOfWeek() && isTimeMatching(reminderTime, now)) {
                    sendReminderNotification(reminder);
                }
                break;
        }
    }


    private boolean isReminderDue(LocalDateTime reminderTime, LocalDateTime now) {
        return reminderTime.getHour() == now.getHour() &&
                reminderTime.getMinute() == now.getMinute();
    }

    private boolean isTimeMatching(LocalDateTime reminderTime, LocalDateTime now) {
        return reminderTime.getHour() == now.getHour() &&
                reminderTime.getMinute() == now.getMinute();
    }


    private void sendReminderNotification(ReminderMongo reminder) {
        String username = reminder.getUsername();
        User user = userRepository.findByUsername(username).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        String message = "Reminder: " + reminder.getDescription() + " is due at " + reminder.getDateTime() + "!";
        boolean isDelivered = false;
        if (isConnection(username)) {
            try {
                messagingTemplate.convertAndSendToUser(username, "/notifications", message);
                isDelivered = true;
            } catch (MessagingException e) {
                isDelivered = false;
            }
        } else {
            emailService.sendReminder(username, user.getEmail(), "Reminder: " + reminder.getTitle() + " is due!", reminderMapper.mapToReminderFromMongo(reminder));

        }
        notificationService.createNotification(reminderMapper.mapToNotificationRequest(reminder, isDelivered));
        log.info("user connected: {}", isConnection(username));
        log.info("That user: {}", username);
        log.info("Notification sent for reminder '{}'.", reminder.getTitle());
    }

    private boolean isConnection(String username) {
        return userRegistry.getUser(username) != null;
    }
}

