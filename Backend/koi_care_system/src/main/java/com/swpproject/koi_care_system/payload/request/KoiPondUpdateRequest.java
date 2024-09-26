package com.swpproject.koi_care_system.payload.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

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
    private MultipartFile file;
    public KoiPondUpdateRequest(String name, int drainCount, int volume, Double depth, int skimmer, Double pumpCapacity, String imageUrl) {
        this.name = name;
        this.drainCount = drainCount;
        this.volume = volume;
        this.depth = depth;
        this.skimmer = skimmer;
        this.pumpCapacity = pumpCapacity;
        this.imageUrl = imageUrl;
    }

}
