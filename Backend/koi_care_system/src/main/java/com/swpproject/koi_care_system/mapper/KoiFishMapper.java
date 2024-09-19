package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.KoiFishDto;
import com.swpproject.koi_care_system.models.KoiFish;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface KoiFishMapper {
    KoiFishDto toDto(KoiFish koiFish);
}
