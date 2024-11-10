package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.ReminderDto;
import com.swpproject.koi_care_system.models.Reminder;
import com.swpproject.koi_care_system.models.ReminderMongo;
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

    @Mapping(target = "username", source = "user.username")
    ReminderMongo mapToReminderMongo(Reminder reminder);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "id", ignore = true)
    void updateReminderFromRequest(@MappingTarget Reminder reminder, ReminderRequest request);

    @Mapping(target = "username", ignore = true)
    void updateReminderMongo(@MappingTarget ReminderMongo reminderMongo, Reminder reminder);

    @Mapping(target = "delivered", source = "isDelivered")
    NotificationRequest mapToNotificationRequest(ReminderMongo reminder, boolean isDelivered);

    @Mapping(target = "user", ignore = true)
    Reminder mapToReminderFromMongo(ReminderMongo reminder);
}
