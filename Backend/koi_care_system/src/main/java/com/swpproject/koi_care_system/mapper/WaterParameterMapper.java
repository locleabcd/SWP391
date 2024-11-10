package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.WaterParameterDto;
import com.swpproject.koi_care_system.models.WaterParameters;
import com.swpproject.koi_care_system.payload.request.ParametersCreateRequest;
import com.swpproject.koi_care_system.payload.request.ParametersUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface WaterParameterMapper {
    @Mapping(target = "koiPond", ignore = true)
    @Mapping(target = "id", ignore = true)
    WaterParameters mapToWaterParameters(ParametersCreateRequest request);

    @Mapping(target = "koiPondName", source = "koiPond.name")
    WaterParameterDto mapToWaterParameterDto(WaterParameters waterParameters);

    @Mapping(target = "koiPond", ignore = true)
    @Mapping(target = "id", ignore = true)
    void updateWaterParameters(@MappingTarget WaterParameters waterParameters, ParametersUpdateRequest request);
}