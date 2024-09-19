package com.swpproject.koi_care_system.payload.request;

import com.swpproject.koi_care_system.models.Image;
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
}
