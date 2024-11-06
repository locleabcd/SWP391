package com.swpproject.koi_care_system.service.notification;

import com.swpproject.koi_care_system.dto.NotificationDto;
import com.swpproject.koi_care_system.payload.request.NotificationRequest;

import java.util.List;

public interface INotificationService {
    NotificationDto createNotification(NotificationRequest request);

    NotificationDto getNotification(Long id);

    List<NotificationDto> getNotifications(Long userId);

    List<NotificationDto> getUnreadNotifications(Long userId);

    void markAsRead(Long id);

    void markAsReadAll(Long userId);

    void deleteNotification(Long id);

    void deleteAllNotifications(Long userId);
}
