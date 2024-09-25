package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.KoiFishDto;
import com.swpproject.koi_care_system.models.KoiFish;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface KoiFishMapper {
    KoiFishDto toDto(KoiFish koiFish);
}
