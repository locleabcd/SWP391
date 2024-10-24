package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.NotificationDto;
import com.swpproject.koi_care_system.models.Notification;
import com.swpproject.koi_care_system.payload.request.NotificationRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NotificationMapper {

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "id", ignore = true)
    Notification mapToNotification(NotificationRequest request);

    NotificationDto mapToNotificationDto(Notification notification);
}
