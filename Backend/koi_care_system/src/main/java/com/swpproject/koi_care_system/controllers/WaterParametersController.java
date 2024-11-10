package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.payload.request.ParametersCreateRequest;
import com.swpproject.koi_care_system.payload.request.ParametersUpdateRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.waterparameter.WaterParameterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("water-parameters")
@RequiredArgsConstructor
public class WaterParametersController {
    private final WaterParameterService waterParameterService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createWaterParameters(@RequestBody ParametersCreateRequest request) {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Water parameters created")
                .data(waterParameterService.createWaterParameters(request))
                .build());
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse> updateWaterParameters(@PathVariable long id, @RequestBody ParametersUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Water parameters updated")
                .data(waterParameterService.updateWaterParameters(id, request))
                .build());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ApiResponse> deleteWaterParameters(@PathVariable long id) {
        waterParameterService.deleteWaterParameters(id);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Water parameters deleted")
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllWaterParameters(@RequestParam(defaultValue = "0") int pageNumber, @RequestParam(defaultValue = "20") int pageSize, @RequestParam(defaultValue = "createDateTime") String sortBy, @RequestParam(defaultValue = "Desc") String sortDir) {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Water parameters list")
                .data(waterParameterService.getAllWaterParameters(pageNumber, pageSize, sortBy, sortDir))
                .build());
    }

    @GetMapping("/getById/{id}")
    public ResponseEntity<ApiResponse> getWaterParametersById(@PathVariable long id) {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Water parameters found")
                .data(waterParameterService.getWaterParametersById(id))
                .build());
    }
    @GetMapping("/getByKoiPondId/{koiPondId}")
    public ResponseEntity<ApiResponse> getWaterParametersByKoiPondId(@PathVariable Long koiPondId){
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Water parameters found")
                .data(waterParameterService.getAllWaterParametersByKoiPondId(koiPondId))
                .build());
    }

    @GetMapping("/getByUserId/{userId}")
    public ResponseEntity<ApiResponse> getWaterParametersByUserId(@PathVariable Long userId){
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Water parameters found")
                .data(waterParameterService.getAllWaterParametersByUserId(userId))
                .build()
        );
    }
    @GetMapping("/getLatestByKoiPondId/{koiPondId}")
    public ResponseEntity<ApiResponse> getLatestWaterParametersByKoiPondId(@PathVariable Long koiPondId){
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Water parameters found")
                .data(waterParameterService.getLatestWaterParametersByKoiPondId(koiPondId))
                .build());
    }
}