package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.payload.request.GrowthCreateRequest;
import com.swpproject.koi_care_system.payload.request.GrowthUpdateRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.growthhistory.IGrowthHistoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("grow-history")
@RequiredArgsConstructor
public class GrowthHistoryController {
    private final IGrowthHistoryService growHistoryService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createGrowthHistory(@RequestBody @Valid GrowthCreateRequest growthCreateRequest) {
        return ResponseEntity.ok(ApiResponse.builder()
                .data(growHistoryService.createGrowthHistory(growthCreateRequest))
                .message("Grow history has been created")
                .build());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse> updateGrowthHistory(@PathVariable Long id, @RequestBody @Valid GrowthUpdateRequest growthUpdateRequest) {
        return ResponseEntity.ok(ApiResponse.builder()
                .data(growHistoryService.updateGrowthHistory(id, growthUpdateRequest))
                .message("Grow history has been updated")
                .build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteGrowthHistory(@PathVariable Long id) {
        growHistoryService.deleteGrowthHistory(id);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Grow history has been deleted")
                .build());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<ApiResponse> getGrowthHistory(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.builder()
                .data(growHistoryService.getGrowthHistory(id))
                .message("Grow history has been found")
                .build());
    }

    @GetMapping("/list/{koiFishId}")
    public ResponseEntity<ApiResponse> getListGrowthHistory(@PathVariable Long koiFishId) {
        return ResponseEntity.ok(ApiResponse.builder()
                .data(growHistoryService.getListGrowthHistory(koiFishId))
                .message("List of grow history has been found")
                .build());
    }


}
