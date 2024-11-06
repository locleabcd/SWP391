package com.swpproject.koi_care_system.dto;

import com.swpproject.koi_care_system.enums.ReminderRepeat;
import lombok.AccessLevel;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReminderDto {
    long id;
    String title;
    String description;
    LocalDateTime dateTime;
    ReminderRepeat repeatInterval;
}
