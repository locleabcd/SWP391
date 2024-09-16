package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.ImageDto;
import com.swpproject.koi_care_system.models.Image;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ImageMapper {

    @Mapping(target = "downloadUrl", source = "downloadUrl")
    ImageDto toDto(Image image);

    @Mapping(target = "fileType", ignore = true)
    @Mapping(target = "image", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "koiFish", ignore = true)
    @Mapping(target = "koiPond", ignore = true)
    Image toEntity(ImageDto imageDto);
}


