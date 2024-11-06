package com.swpproject.koi_care_system.payload.request;

import com.swpproject.koi_care_system.enums.ReminderRepeat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReminderRequest {
    private String title;
    private String description;
    private LocalDateTime dateTime;
    private ReminderRepeat repeatInterval;

}
