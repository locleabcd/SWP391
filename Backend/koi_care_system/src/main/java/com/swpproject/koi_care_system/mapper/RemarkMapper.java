package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.RemarkDto;
import com.swpproject.koi_care_system.models.Remark;
import com.swpproject.koi_care_system.payload.request.RemarkCreateRequest;
import com.swpproject.koi_care_system.payload.request.RemarkUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RemarkMapper {
    @Mapping(target = "koiFish", ignore = true)
    @Mapping(target = "id", ignore = true)
    Remark mapToRemark(RemarkCreateRequest remarkCreateRequest);

    @Mapping(target = "koiFishId", source = "koiFish.id")
    RemarkDto mapToRemarkDto(Remark remark);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "koiFish", ignore = true)
    void updateRemark(@MappingTarget Remark remark, RemarkUpdateRequest remarkUpdateRequest);

}