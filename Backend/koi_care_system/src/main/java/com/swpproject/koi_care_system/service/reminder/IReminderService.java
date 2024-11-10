package com.swpproject.koi_care_system.service.reminder;

import com.swpproject.koi_care_system.dto.ReminderDto;
import com.swpproject.koi_care_system.payload.request.ReminderRequest;

import java.security.Principal;
import java.util.List;

public interface IReminderService {
    ReminderDto createReminder(ReminderRequest request, Principal connectedUser);

    ReminderDto updateReminder(Long id, ReminderRequest request);

    void deleteReminder(Long id);

    List<ReminderDto> getListReminder();

    List<ReminderDto> getListReminderByUser(Principal connectedUser);

    void checkReminders();
}
