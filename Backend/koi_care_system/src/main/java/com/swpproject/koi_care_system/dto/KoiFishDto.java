package com.swpproject.koi_care_system.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KoiFishDto {
    private Long id;
    private String name;
    private String physique;
    private int age;
    private Double length;
    private Double weight;
    private String gender;
    private String variety;
    private LocalDate pondDate;
    private String breeder;
    private Double price;
    private String imageUrl;
    private KoiPondDto koiPond;
    private String status;
}