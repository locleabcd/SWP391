package com.swpproject.koi_care_system.payload.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GetFishPondWaterReportRequest {
    private Long userId;
    private LocalDate date;
}
