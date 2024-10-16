package com.swpproject.koi_care_system.service.reminder;

import com.swpproject.koi_care_system.dto.ReminderDto;
import com.swpproject.koi_care_system.mapper.ReminderMapper;
import com.swpproject.koi_care_system.models.Reminder;
import com.swpproject.koi_care_system.payload.request.ReminderRequest;
import com.swpproject.koi_care_system.repository.ReminderRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReminderService implements IReminderService {
    ReminderRepository reminderRepository;
    ReminderMapper reminderMapper;
    SimpMessagingTemplate messagingTemplate;


    @Override
    public ReminderDto createReminder(ReminderRequest request) {
        Reminder reminder = reminderMapper.mapToReminders(request);
        ReminderDto savedReminder = reminderMapper.mapToReminderDto(reminderRepository.save(reminder));
        // Schedule WebSocket notification
        sendReminderNotification(savedReminder);
        return savedReminder;
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


    @Override
    public List<ReminderDto> getRemindersForNext5Minutes() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime fiveMinutesLater = now.plusMinutes(1);
        List<Reminder> reminders = reminderRepository.findAllByDateTimeBetween(now, fiveMinutesLater); // Check reminders within the next 5 minutes
        return reminders.stream().map(reminderMapper::mapToReminderDto).toList();
    }

    @Scheduled(fixedRate = 10000) // Check reminders every 1 second
    public void checkAndSendReminders() {
        LocalDateTime now = LocalDateTime.now();
        List<Reminder> matchingReminders = reminderRepository.findAllByDateTime(now);
        log.info("Found {} reminders to send", matchingReminders.size());

        for (ReminderDto reminder : matchingReminders.stream().map(reminderMapper::mapToReminderDto).toList()) {
            log.info("Sending reminder notification for: {}", reminder.getTitle());
            sendReminderNotification(reminder);
        }
    }

    private void sendReminderNotification(ReminderDto reminder) {
        String message = "Reminder: " + reminder.getTitle() + " is due soon!";
        messagingTemplate.convertAndSend("/topic/notifications", message); // Send message via WebSocket
    }

}
