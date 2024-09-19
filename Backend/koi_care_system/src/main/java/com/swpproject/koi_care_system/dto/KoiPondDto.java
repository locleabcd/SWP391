package com.swpproject.koi_care_system.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KoiPondDto {
    private Long id;
    private String name;
    private int drainCount;
    private int volume;
    private Double depth;
    private int skimmer;
    private Double pumpCapacity;
    private String imageUrl;
}
