package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.SubscribePlanDto;
import com.swpproject.koi_care_system.models.SubscribePlan;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SubscribeMapper {
    @Mapping(target = "userProfileDto", ignore = true)
    SubscribePlanDto maptoDto(SubscribePlan subscribePlan);
}
