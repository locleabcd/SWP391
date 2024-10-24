package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.report.FishGrowthReportService;
import com.swpproject.koi_care_system.service.report.FishPondWaterTimeReportService;
import com.swpproject.koi_care_system.service.report.ProductReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RequiredArgsConstructor
@RestController
@RequestMapping("/reports")
public class ReportController {
    private final ProductReportService productReportService;
    private final FishPondWaterTimeReportService fishPondWaterTimeReportService;
    private final FishGrowthReportService fishGrowthReportService;
    @GetMapping("/product")
    public ResponseEntity<ApiResponse> getProductReport(){
        return ResponseEntity.ok(ApiResponse.builder()
                        .message("Get report success")
                        .data(productReportService.getProductReport())
                .build());
    }

    @GetMapping("/category")
    public ResponseEntity<ApiResponse> getProductCategoryReport(){
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Get report success")
                .data(productReportService.getProductCategoryReport())
                .build());
    }
    @GetMapping("/FishPondWater")
    public ResponseEntity<ApiResponse> getFishPondWaterTimeReport(@RequestParam Long userId, @RequestParam LocalDate date){
        return ResponseEntity.ok(ApiResponse.builder()
                        .message("Get report success")
                        .data(fishPondWaterTimeReportService.getFishPondWaterTimeReport(userId,date))
                .build());
    }

    @GetMapping("/GrowthFish/{koiFishId}")
    public ResponseEntity<ApiResponse> getGrowthFishReport(@PathVariable Long koiFishId){
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Get report success")
                .data(fishGrowthReportService.getFishGrowthReport(koiFishId))
                .build());
    }
}
