package com.swpproject.koi_care_system.models;

import com.swpproject.koi_care_system.enums.ReminderRepeat;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Reminder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;
    String title;
    LocalDateTime dateTime;
    String description;
    @Enumerated(EnumType.STRING)
    ReminderRepeat repeatInterval;
    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;

}
