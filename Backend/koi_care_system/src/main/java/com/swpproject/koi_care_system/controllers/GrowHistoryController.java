package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.payload.request.GrowCreateRequest;
import com.swpproject.koi_care_system.payload.request.GrowUpdateRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.growhistory.IGrowHistoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("grow-history")
@RequiredArgsConstructor
public class GrowHistoryController {
    private final IGrowHistoryService growHistoryService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createGrowHistory(@RequestBody @Valid GrowCreateRequest growCreateRequest) {
        return ResponseEntity.ok(ApiResponse.builder()
                .data(growHistoryService.createGrowHistory(growCreateRequest))
                .message("Grow history has been created")
                .build());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse> updateGrowHistory(@PathVariable Long id, @RequestBody @Valid GrowUpdateRequest growUpdateRequest) {
        return ResponseEntity.ok(ApiResponse.builder()
                .data(growHistoryService.updateGrowHistory(id, growUpdateRequest))
                .message("Grow history has been updated")
                .build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteGrowHistory(@PathVariable Long id) {
        growHistoryService.deleteGrowHistory(id);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Grow history has been deleted")
                .build());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<ApiResponse> getGrowHistory(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.builder()
                .data(growHistoryService.getGrowHistory(id))
                .message("Grow history has been found")
                .build());
    }

    @GetMapping("/list/{koiFishId}")
    public ResponseEntity<ApiResponse> getListGrowHistory(@PathVariable Long koiFishId) {
        return ResponseEntity.ok(ApiResponse.builder()
                .data(growHistoryService.getListGrowHistory(koiFishId))
                .message("List of grow history has been found")
                .build());
    }


}
