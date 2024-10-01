package com.swpproject.koi_care_system.service.promotion;

import com.swpproject.koi_care_system.dto.PromotionDto;
import com.swpproject.koi_care_system.payload.request.AddPromotionRequest;
import com.swpproject.koi_care_system.payload.request.PromotionUpdateRequest;

import java.util.List;

public interface IPromotionService {

    PromotionDto createPromotion(AddPromotionRequest addPromotionRequest);
    PromotionDto updatePromotion(Long id, PromotionUpdateRequest promotionUpdateRequest);

    void deletePromotion(Long id);

    PromotionDto getPromotionById(Long id);

    List<PromotionDto> getAllPromotions();
    void addProductsToPromotion(Long promotionId, List<Long> productIds);


}