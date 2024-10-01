package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.GrowHistoryDto;
import com.swpproject.koi_care_system.models.GrowHistory;
import com.swpproject.koi_care_system.payload.request.GrowCreateRequest;
import com.swpproject.koi_care_system.payload.request.GrowUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface GrowHistoryMapper {
    @Mapping(target = "koiFish", ignore = true)
    @Mapping(target = "id", ignore = true)
    GrowHistory mapToGrowHistory(GrowCreateRequest growCreateRequest);

    @Mapping(target = "koiFishName", source = "koiFish.name")
    GrowHistoryDto mapToGrowHistoryDto(GrowHistory growHistory);

    @Mapping(target = "koiFish", ignore = true)
    @Mapping(target = "id", ignore = true)
    void updateGrowHistory(@MappingTarget GrowHistory growHistory, GrowUpdateRequest growUpdateRequest);
}
