package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.PromotionDto;
import com.swpproject.koi_care_system.models.Promotion;
import com.swpproject.koi_care_system.payload.request.AddPromotionRequest;
import com.swpproject.koi_care_system.payload.request.PromotionUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PromotionMapper {
    @Mapping(target = "products", ignore = true)
    Promotion mapToPromotion(AddPromotionRequest addPromotionRequest);

    PromotionDto mapToDto(Promotion promotion);

    @Mapping(target = "products", ignore = true)
    void updatePromotion(@MappingTarget Promotion promotion, PromotionUpdateRequest promotionUpdateRequest);
}