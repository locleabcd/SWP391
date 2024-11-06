package com.swpproject.koi_care_system.enums;

import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@FieldDefaults(makeFinal = true)
public enum ReminderRepeat {
    ONE_TIME,
    DAILY,
    WEEKLY,
}
