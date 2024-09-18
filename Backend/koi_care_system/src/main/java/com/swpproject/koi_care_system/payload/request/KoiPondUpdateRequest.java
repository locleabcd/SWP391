package com.swpproject.koi_care_system.payload.request;

import com.swpproject.koi_care_system.models.Image;
import lombok.Data;

@Data
public class KoiPondUpdateRequest {
    private Long id;
    private String name;
    private int drainCount;
    private Double depth;
    private int skimmer;
    private Double pumpCapacity;
    private Image image;
}
