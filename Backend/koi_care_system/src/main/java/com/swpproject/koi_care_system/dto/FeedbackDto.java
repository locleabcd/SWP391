package com.swpproject.koi_care_system.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class FeedbackDto {
    private Long id;
    private int star;
    private String comment;
    private String username;
    private Long userId;
    private Long product_id;
}
