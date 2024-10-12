package com.swpproject.koi_care_system.dto;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class GrowthHistoryDto {
    Long id;
    LocalDateTime createDate;
    String physique;
    Double length;
    Double weight;
    String imageUrl;
    String koiFishName;
}