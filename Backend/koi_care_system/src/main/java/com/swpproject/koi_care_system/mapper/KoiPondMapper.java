package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.KoiPondDto;
import com.swpproject.koi_care_system.models.KoiPond;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")

public interface KoiPondMapper {
    KoiPondDto toDto(KoiPond koiPond);
}
