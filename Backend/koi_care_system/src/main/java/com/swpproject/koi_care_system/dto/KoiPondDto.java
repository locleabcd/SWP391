package com.swpproject.koi_care_system.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KoiPondDto {
    private Long id;
    private String name;
    private LocalDate createDate;
    private int drainCount;
    private int volume;
    private Double depth;
    private int skimmer;
    private Double pumpCapacity;
    private String imageUrl;
}