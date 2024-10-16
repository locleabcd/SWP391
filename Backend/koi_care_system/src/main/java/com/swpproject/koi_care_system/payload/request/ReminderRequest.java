package com.swpproject.koi_care_system.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReminderRequest {
    private String title;
    private LocalDateTime dateTime;
    private String repeatInterval;

}
