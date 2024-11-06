package com.swpproject.koi_care_system.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class OriginStateOfFishDto {
    private Long id;
    private String name;
    private String physique;
    private LocalDate pondDate;
    private int age;
    private Double length;
    private Double weight;
    private String gender;
    private String variety;
    private Long koiFishId;

}
