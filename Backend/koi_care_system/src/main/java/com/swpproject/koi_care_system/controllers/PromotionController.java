package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.dto.PromotionDto;
import com.swpproject.koi_care_system.payload.request.AddPromotionRequest;
import com.swpproject.koi_care_system.payload.request.AdminConfirmPromotionRequest;
import com.swpproject.koi_care_system.payload.request.PromotionUpdateRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.promotion.IPromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PostAuthorize;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@RestController
@RequestMapping("/promotions")
@RequiredArgsConstructor
public class PromotionController {
    private final IPromotionService promotionService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createPromotion(@RequestBody AddPromotionRequest addPromotionRequest){
        try{
            PromotionDto promotion = promotionService.createPromotion(addPromotionRequest);
            return ResponseEntity.ok(new ApiResponse("Create promotion success",promotion));
        }catch (Exception e){
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PutMapping("/promotion/{id}/update")
    public ResponseEntity<ApiResponse> updatePromotion(@PathVariable Long id, @RequestBody PromotionUpdateRequest promotionUpdateRequest){
        try{
            PromotionDto promotionDto = promotionService.updatePromotion(id,promotionUpdateRequest);
            return ResponseEntity.ok(new ApiResponse("Update promotion success", promotionDto));
        }catch (Exception e){
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
        }
    }
    @PutMapping("/promotion/confirm")
    public ResponseEntity<ApiResponse> confirmPromotion(@RequestBody AdminConfirmPromotionRequest request){
        try{
            PromotionDto promotionDto = promotionService.verifyByAdmin(request);
            return ResponseEntity.ok(new ApiResponse("Update promotion success", promotionDto));
        }catch (Exception e){
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @DeleteMapping("/promotion/{id}/delete")
    public ResponseEntity<ApiResponse> deletePromotion(@PathVariable Long id){
        try{
            promotionService.deletePromotion(id);
            return ResponseEntity.ok(new ApiResponse("Delete promotion success", null));
        }catch (Exception e){
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(),null));
        }
    }
    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllPromotions(){
        try{
            List<PromotionDto> promotionDtoList = promotionService.getAllPromotions();
            return ResponseEntity.ok(new ApiResponse("Found", promotionDtoList));
        }catch (Exception e){
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(),null));
        }
    }
    @GetMapping("/promotion/{id}")
    public ResponseEntity<ApiResponse> getPromotionById(@PathVariable Long id){
        try{
            PromotionDto promotionDto = promotionService.getPromotionById(id);
            return ResponseEntity.ok(new ApiResponse("Found",promotionDto));
        }catch (Exception e){
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(),null));
        }
    }

    @GetMapping("/promotion/request")
    public ResponseEntity<ApiResponse> getPromotionRequest(){
        try {
            List<PromotionDto> promotionDtoList = promotionService.getAllPromotionsRequest();
            return ResponseEntity.ok(new ApiResponse("Found",promotionDtoList));
        }catch (Exception e){
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(),null));
        }
    }

    @PostMapping("/{promotionId}/products")
    public ResponseEntity<ApiResponse> addProductsToPromotion(@PathVariable Long promotionId, @RequestParam List<Long> productIds) {
        try{
            promotionService.addProductsToPromotion(promotionId, productIds);
            return ResponseEntity.ok(new ApiResponse("Add products to promotion success",null));
        }catch (Exception e) {
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
        }
    }
}