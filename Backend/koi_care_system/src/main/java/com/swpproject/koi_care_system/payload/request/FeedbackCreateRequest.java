package com.swpproject.koi_care_system.payload.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackCreateRequest {
    private int star;
    private String comment;
    private Long userId;
    private Long productId;

}
