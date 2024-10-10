package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.LogDto;
import com.swpproject.koi_care_system.models.Log;
import com.swpproject.koi_care_system.payload.request.LogCreateRequest;
import com.swpproject.koi_care_system.payload.request.LogUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface LogMapper {

    @Mapping(target = "koiPond", ignore = true)
    @Mapping(target = "logId", ignore = true)
    Log mapToLog(LogCreateRequest request);

    @Mapping(target = "koiPondName", source = "koiPond.name")
    LogDto mapToLogDto(Log log);

    @Mapping(target = "koiPond", ignore = true)
    @Mapping(target = "logId", ignore = true)
    void updateLog(@MappingTarget Log log, LogUpdateRequest request);
}