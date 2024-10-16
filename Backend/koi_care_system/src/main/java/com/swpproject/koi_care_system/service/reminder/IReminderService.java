package com.swpproject.koi_care_system.service.reminder;

import com.swpproject.koi_care_system.dto.ReminderDto;
import com.swpproject.koi_care_system.payload.request.ReminderRequest;

import java.util.List;

public interface IReminderService {
    ReminderDto createReminder(ReminderRequest request);

    ReminderDto updateReminder(Long id, ReminderRequest request);

    void deleteReminder(Long id);

    List<ReminderDto> getListReminder();

    List<ReminderDto> getRemindersForNext5Minutes();
}
