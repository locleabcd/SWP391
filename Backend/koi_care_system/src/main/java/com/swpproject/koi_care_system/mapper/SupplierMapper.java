package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.models.Supplier;
import com.swpproject.koi_care_system.payload.request.AddSupplierRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SupplierMapper {
    @Mapping(target = "productList", ignore = true)
    Supplier mapToSupplier(AddSupplierRequest addSupplierRequest);
}