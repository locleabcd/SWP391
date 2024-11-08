package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.ProductDto;
import com.swpproject.koi_care_system.dto.PromotionDto;
import com.swpproject.koi_care_system.models.Product;
import com.swpproject.koi_care_system.models.Promotion;
import org.mapstruct.Mapper;

@Mapper()
public interface ProductMapper {

    ProductDto mapToProductDto(Product product);
    PromotionDto mapToPromotionDto(Promotion promotion);
}