package com.swpproject.koi_care_system.payload.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UpgradePremiumRequest {
    private Long userProfileId;
    private String time;
}
