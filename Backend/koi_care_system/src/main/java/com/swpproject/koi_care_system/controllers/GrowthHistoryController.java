package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.payload.request.GrowthCreateRequest;
import com.swpproject.koi_care_system.payload.request.GrowthUpdateRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.growthhistory.IGrowthHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@RestController
@RequestMapping("growth-history")
@RequiredArgsConstructor
public class GrowthHistoryController {
    private final IGrowthHistoryService growthHistoryService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createGrowHistory(@ModelAttribute GrowthCreateRequest growCreateRequest) {
        try{
            return ResponseEntity.ok(ApiResponse.builder()
                    .data(growthHistoryService.createGrowthHistory(growCreateRequest))
                    .message("Growth history has been created")
                    .build());
        }catch (Exception e){
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("Error", INTERNAL_SERVER_ERROR));
        }

    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse> updateGrowHistory(@PathVariable Long id, @ModelAttribute GrowthUpdateRequest growUpdateRequest) {
        return ResponseEntity.ok(ApiResponse.builder()
                .data(growthHistoryService.updateGrowthHistory(id, growUpdateRequest))
                .message("Growth history has been updated")
                .build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteGrowHistory(@PathVariable Long id) {
        growthHistoryService.deleteGrowthHistory(id);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Grow history has been deleted")
                .build());
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<ApiResponse> getGrowHistory(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.builder()
                .data(growthHistoryService.getGrowthHistory(id))
                .message("Grow history has been found")
                .build());
    }

    @GetMapping("/list/{koiFishId}")
    public ResponseEntity<ApiResponse> getListGrowHistory(@PathVariable Long koiFishId) {
        return ResponseEntity.ok(ApiResponse.builder()
                .data(growthHistoryService.getListGrowthHistory(koiFishId))
                .message("List of grow history has been found")
                .build());
    }


}