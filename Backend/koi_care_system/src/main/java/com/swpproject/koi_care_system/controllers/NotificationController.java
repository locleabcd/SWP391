package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.notification.INotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final INotificationService notificationService;

    @GetMapping("/list/{userId}")
    public ResponseEntity<ApiResponse> getListNotification(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("List of notifications")
                .data(notificationService.getNotifications(userId))
                .build());
    }

    @GetMapping("/list-unread/{userId}")
    public ResponseEntity<ApiResponse> getListUnreadNotification(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("List of unread notifications")
                .data(notificationService.getUnreadNotifications(userId))
                .build());
    }

    @GetMapping("/mark-as-read/{id}")
    public ResponseEntity<ApiResponse> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Notification marked as read")
                .build());
    }

    @GetMapping("/mark-as-read-all/{id}")
    public ResponseEntity<ApiResponse> markAsReadAll(@PathVariable Long id) {
        notificationService.markAsReadAll(id);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("All notifications marked as read")
                .build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Notification deleted")
                .build());
    }

    @DeleteMapping("/delete-all/{userId}")
    public ResponseEntity<ApiResponse> deleteAllNotifications(@PathVariable Long userId) {
        notificationService.deleteAllNotifications(userId);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("All notifications deleted")
                .build());
    }
}
