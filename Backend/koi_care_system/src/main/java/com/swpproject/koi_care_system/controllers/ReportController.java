package com.swpproject.koi_care_system.controllers;

import com.azure.core.annotation.Get;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.report.ProductReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/reports")
public class ReportController {
    private final ProductReportService productReportService;
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
}
