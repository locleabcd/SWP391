package com.swpproject.koi_care_system.payload.request;

import lombok.Data;

@Data
public class KoiPondUpdateRequest {
    private Long id;
    private String name;
    private int drainCount;
    private int volume;
    private Double depth;
    private int skimmer;
    private Double pumpCapacity;
    private String imageUrl;

}
