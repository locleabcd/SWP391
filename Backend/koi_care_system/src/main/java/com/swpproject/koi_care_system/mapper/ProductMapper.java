package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.ProductDto;
import com.swpproject.koi_care_system.models.Product;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    ProductDto toDto(Product product);

//    Product toEntity(ProductDto productDto);
}
