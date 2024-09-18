package com.swpproject.koi_care_system.dto;

import com.swpproject.koi_care_system.models.Image;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KoiPondDto {
    private Long id;
    private String name;
    private int drainCount;
    private Double depth;
    private int skimmer;
    private Double pumpCapacity;
    private ImageDto image;
}
