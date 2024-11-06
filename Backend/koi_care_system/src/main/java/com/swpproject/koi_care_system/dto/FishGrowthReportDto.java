package com.swpproject.koi_care_system.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FishGrowthReportDto {
    Long id;
    LocalDateTime createDate;
    String physique;
    Double length;
    Double weight;
}
