package com.swpproject.koi_care_system.payload.request;

import lombok.Data;

@Data
public class UpgradePremiumRequest {
    private Long userProfileId;
    private String time;
}
