package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.ProductDto;
import com.swpproject.koi_care_system.models.Product;
import com.swpproject.koi_care_system.payload.request.AddProductRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    ProductDto mapToProductDto(Product product);
    @Mapping(target = "images", ignore = true)
    Product mapToProduct(AddProductRequest request);

//    Product toEntity(ProductDto productDto);
}
