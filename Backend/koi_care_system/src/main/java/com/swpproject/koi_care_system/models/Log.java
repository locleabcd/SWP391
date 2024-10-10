package com.swpproject.koi_care_system.models;

import com.swpproject.koi_care_system.enums.LogCategory;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "logs")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Log {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int logId;
    @Column(name = "log_title", nullable = false)
    String logTitle;
    @Column(name = "date_time", nullable = false)
    LocalDateTime logDate;
    @Enumerated(EnumType.STRING)
    LogCategory category;
    String note;
    @ManyToOne
    @JoinColumn(name="koiPond_id")
    KoiPond koiPond;


}