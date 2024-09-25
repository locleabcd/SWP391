package com.swpproject.koi_care_system.payload.request;

import com.swpproject.koi_care_system.models.User;
import lombok.Data;

@Data
public class AddKoiPondRequest {
    private Long id;
    private String name;
    private int drainCount;
    private int volume;
    private Double depth;
    private int skimmer;
    private Double pumpCapacity;
    private User user;
    private String imageUrl;
    public AddKoiPondRequest(String name, int drainCount, int volume, Double depth, int skimmer, Double pumpCapacity, User user, String imageUrl) {
        this.name = name;
        this.drainCount = drainCount;
        this.volume = volume;
        this.depth = depth;
        this.skimmer = skimmer;
        this.pumpCapacity = pumpCapacity;
        this.user = user;
        this.imageUrl = imageUrl;
    }
}
