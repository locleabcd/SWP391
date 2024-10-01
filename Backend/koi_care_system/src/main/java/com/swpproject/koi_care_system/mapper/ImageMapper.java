package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.ImageDto;
import com.swpproject.koi_care_system.models.Image;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ImageMapper {
    ImageDto mapToImageDto(Image image);
}