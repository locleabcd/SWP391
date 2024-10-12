package com.swpproject.koi_care_system.payload.request;

import com.swpproject.koi_care_system.enums.PromotionStatus;
import lombok.Data;

@Data
public class AdminConfirmPromotionRequest {
    Long promotionId;
    PromotionStatus status;
}
