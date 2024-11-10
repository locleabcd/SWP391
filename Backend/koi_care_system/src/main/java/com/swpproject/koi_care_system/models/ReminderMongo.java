package com.swpproject.koi_care_system.models;

import com.swpproject.koi_care_system.enums.ReminderRepeat;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Document(collection = "reminders")
public class ReminderMongo {

    @Id
    Long id;//String will auto-gene
    String title;
    String dateTime;
    String description;
    ReminderRepeat repeatInterval;
    String username;
}
