package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.KoiPondDto;
import com.swpproject.koi_care_system.models.KoiPond;
import com.swpproject.koi_care_system.payload.request.AddKoiPondRequest;
import com.swpproject.koi_care_system.payload.request.KoiFishUpdateRequest;
import com.swpproject.koi_care_system.payload.request.KoiPondUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")

public interface KoiPondMapper {
    KoiPondDto toDto(KoiPond koiPond);

    @Mapping(target = "waterParametersList", ignore = true)
    @Mapping(target = "logList", ignore = true)
    KoiPond mapToKoiPond(AddKoiPondRequest addKoiPondRequest);
    List<KoiPondDto> mapToKoiPondDto(List<KoiPond> list);
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "waterParametersList", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "logList", ignore = true)
    void updateToKoiPond(@MappingTarget KoiPond koiPond, KoiPondUpdateRequest koiPondUpdateRequest);

}