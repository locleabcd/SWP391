package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.payload.request.ReminderRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.reminder.IReminderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/reminders")
@RequiredArgsConstructor
public class ReminderController {
    private final IReminderService reminderService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createReminder(@RequestBody ReminderRequest request, Principal connectedUser) {
        return ResponseEntity.status(201).body(ApiResponse.builder()
                .message("Reminder created successfully")
                .data(reminderService.createReminder(request, connectedUser))
                .build());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse> updateReminder(@PathVariable Long id, @RequestBody ReminderRequest request) {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Reminder updated successfully")
                .data(reminderService.updateReminder(id, request))
                .build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteReminder(@PathVariable Long id) {
        reminderService.deleteReminder(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/list")
    public ResponseEntity<ApiResponse> getListReminder() {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("List of reminders")
                .data(reminderService.getListReminder())
                .build());
    }

    @GetMapping("/list/user")
    public ResponseEntity<ApiResponse> getListReminderByUser(Principal connectedUser) {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("List of reminders")
                .data(reminderService.getListReminderByUser(connectedUser))
                .build());
    }
}
