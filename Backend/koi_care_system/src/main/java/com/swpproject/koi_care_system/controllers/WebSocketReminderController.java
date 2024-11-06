package com.swpproject.koi_care_system.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebSocketReminderController {

    @GetMapping("/reminders")
    public String notificationsPage() {
        return "reminders"; // This points to the reminders.html file
    }
}

