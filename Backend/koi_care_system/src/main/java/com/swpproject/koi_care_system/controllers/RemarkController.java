package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.payload.request.RemarkCreateRequest;
import com.swpproject.koi_care_system.payload.request.RemarkUpdateRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.remark.IRemarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/remark")
@RestController
@RequiredArgsConstructor
public class RemarkController {
    private final IRemarkService remarkService;

    @PostMapping("/create")
    ResponseEntity<ApiResponse> createRemark(@RequestBody RemarkCreateRequest remarkCreateRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.builder()
                .data(remarkService.createRemark(remarkCreateRequest))
                .message("Remark has been created")
                .build());
    }

    @PutMapping("/update/{remarkId}")
    ResponseEntity<ApiResponse> updateRemark(@PathVariable Long remarkId, @RequestBody RemarkUpdateRequest remarkUpdateRequest) {
        return ResponseEntity.ok(ApiResponse.builder()
                .data(remarkService.updateRemark(remarkId, remarkUpdateRequest))
                .message("Remark has been updated")
                .build());
    }

    @DeleteMapping("/delete/{remarkId}")
    ResponseEntity<ApiResponse> deleteRemark(@PathVariable Long remarkId) {
        remarkService.deleteRemark(remarkId);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Remark has been deleted")
                .build());
    }

    @GetMapping("/get/{remarkId}")
    ResponseEntity<ApiResponse> getRemark(@PathVariable Long remarkId) {
        return ResponseEntity.ok(ApiResponse.builder()
                .data(remarkService.getRemark(remarkId))
                .message("Remark found")
                .build());
    }

    @GetMapping("/get-all/{koiFishId}")
    ResponseEntity<ApiResponse> getRemarksByKoiFish(@PathVariable Long koiFishId) {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("List of remarks")
                .data(remarkService.getRemarksByKoiFish(koiFishId))
                .build());
    }

}