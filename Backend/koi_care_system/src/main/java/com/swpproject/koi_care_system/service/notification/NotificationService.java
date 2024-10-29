package com.swpproject.koi_care_system.service.notification;

import com.swpproject.koi_care_system.dto.NotificationDto;
import com.swpproject.koi_care_system.enums.ErrorCode;
import com.swpproject.koi_care_system.exceptions.AppException;
import com.swpproject.koi_care_system.mapper.NotificationMapper;
import com.swpproject.koi_care_system.models.Notification;
import com.swpproject.koi_care_system.models.User;
import com.swpproject.koi_care_system.payload.request.NotificationRequest;
import com.swpproject.koi_care_system.repository.NotificaitonRepository;
import com.swpproject.koi_care_system.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationService implements INotificationService {

    NotificationMapper notificationMapper;
    NotificaitonRepository notificaitonRepository;
    UserRepository userRepository;

    @Override
    public NotificationDto createNotification(NotificationRequest request) {
        Notification notification = notificationMapper.mapToNotification(request);
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        notification.setUser(user);
        return notificationMapper.mapToNotificationDto(notificaitonRepository.save(notification));
    }

    @Override
    public NotificationDto getNotification(Long id) {
        return notificationMapper.mapToNotificationDto(notificaitonRepository.findById(id).orElseThrow());
    }

    @Override
    public List<NotificationDto> getNotifications(Long userId) {
        List<Notification> notifications = notificaitonRepository.findAllByUserId(userId);
        return notifications.stream().map(notificationMapper::mapToNotificationDto).toList();
    }

    @Override
    public List<NotificationDto> getUnreadNotifications(Long userId) {
        List<Notification> notifications = notificaitonRepository.findByUserIdAndDeliveredFalse(userId);
        return notifications.stream().map(notificationMapper::mapToNotificationDto).toList();
    }

    @Override
    public void markAsRead(Long id) {
        Notification notification = notificaitonRepository.findById(id).orElseThrow();
        notification.setDelivered(true);
        notificaitonRepository.save(notification);
    }

    @Override
    public void markAsReadAll(Long userId) {
        List<Notification> notifications = notificaitonRepository.findByUserIdAndDeliveredFalse(userId);
        notifications.forEach(notification -> notification.setDelivered(true));
        notificaitonRepository.saveAll(notifications);
    }

    @Override
    public void deleteNotification(Long id) {
        Notification notification = notificaitonRepository.findById(id).orElseThrow();
        notificaitonRepository.delete(notification);
    }

    @Override
    public void deleteAllNotifications(Long userId) {
        List<Notification> notifications = notificaitonRepository.findAllByUserId(userId);
        notificaitonRepository.deleteAll(notifications);
    }
}
