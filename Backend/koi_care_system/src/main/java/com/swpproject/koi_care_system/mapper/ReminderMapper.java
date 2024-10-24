package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.ReminderDto;
import com.swpproject.koi_care_system.models.Reminder;
import com.swpproject.koi_care_system.payload.request.NotificationRequest;
import com.swpproject.koi_care_system.payload.request.ReminderRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ReminderMapper {

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "id", ignore = true)
    Reminder mapToReminders(ReminderRequest request);

    ReminderDto mapToReminderDto(Reminder reminder);

    void updateReminderFromRequest(@MappingTarget ReminderRequest request, Reminder reminder);

    @Mapping(target = "userId", source = "reminder.user.id")
    @Mapping(target = "message", source = "reminder.title")
    @Mapping(target = "delivered", source = "isDelivered")
    NotificationRequest mapToNotificationRequest(Reminder reminder, boolean isDelivered);
}
