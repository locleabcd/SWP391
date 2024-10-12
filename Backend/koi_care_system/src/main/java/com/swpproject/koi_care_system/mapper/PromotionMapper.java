package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.PromotionDto;
import com.swpproject.koi_care_system.models.Promotion;
import com.swpproject.koi_care_system.payload.request.AddPromotionRequest;
import com.swpproject.koi_care_system.payload.request.AdminConfirmPromotionRequest;
import com.swpproject.koi_care_system.payload.request.PromotionUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface PromotionMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", constant = "PENDING")
    @Mapping(target = "products", ignore = true)
    Promotion mapToPromotion(AddPromotionRequest addPromotionRequest);

    PromotionDto mapToDto(Promotion promotion);

    @Mapping(target = "products", ignore = true)
    void updatePromotion(@MappingTarget Promotion promotion, PromotionUpdateRequest promotionUpdateRequest);

    @Mapping(target = "startDate", ignore = true)
    @Mapping(target = "products", ignore = true)
    @Mapping(target = "name", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "endDate", ignore = true)
    @Mapping(target = "discountRate", ignore = true)
    @Mapping(target = "description", ignore = true)
    void confirmPromotion(@MappingTarget Promotion promotion, AdminConfirmPromotionRequest request);
}