package com.swpproject.koi_care_system.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationDto {
    Long id;
    String title;
    String description;
    boolean delivered;
    LocalDateTime dateTime;
}
