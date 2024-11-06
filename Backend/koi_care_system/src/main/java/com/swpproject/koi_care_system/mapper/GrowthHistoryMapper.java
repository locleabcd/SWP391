package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.GrowthHistoryDto;
import com.swpproject.koi_care_system.models.GrowthHistory;
import com.swpproject.koi_care_system.payload.request.GrowthCreateRequest;
import com.swpproject.koi_care_system.payload.request.GrowthUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface GrowthHistoryMapper {
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "koiFish", ignore = true)
    @Mapping(target = "id", ignore = true)
    GrowthHistory mapToGrowthHistory(GrowthCreateRequest growthCreateRequest);

    @Mapping(target = "koiFishName", source = "koiFish.name")
    GrowthHistoryDto mapToGrowthHistoryDto(GrowthHistory growthHistory);

    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "koiFish", ignore = true)
    @Mapping(target = "id", ignore = true)
    void updateGrowthHistory(@MappingTarget GrowthHistory growthHistory, GrowthUpdateRequest growthUpdateRequest);
}