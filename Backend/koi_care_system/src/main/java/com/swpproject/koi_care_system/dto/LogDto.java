package com.swpproject.koi_care_system.dto;

import com.swpproject.koi_care_system.enums.LogCategory;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LogDto {
    int logId;
    String logTitle;
    LocalDateTime logDate;
    LogCategory category;
    String note;
    String koiPondName;
}