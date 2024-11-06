package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.KoiFishDto;
import com.swpproject.koi_care_system.models.KoiFish;
import com.swpproject.koi_care_system.payload.request.AddKoiFishRequest;
import com.swpproject.koi_care_system.payload.request.KoiFishUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface KoiFishMapper {
    KoiFishDto toDto(KoiFish koiFish);

    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "koiPond", ignore = true)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "remarkList", ignore = true)
    @Mapping(target = "growthHistoryList", ignore = true)
    KoiFish mapToKoiFish(AddKoiFishRequest addKoiFishRequest);

    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "weight", ignore = true)
    @Mapping(target = "remarkList", ignore = true)
    @Mapping(target = "physique", ignore = true)
    @Mapping(target = "length", ignore = true)
    @Mapping(target = "growthHistoryList", ignore = true)
    void updateToKoiFish(@MappingTarget KoiFish koiFish, KoiFishUpdateRequest koiFishUpdateRequest);

}