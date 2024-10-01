package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.TagDto;
import com.swpproject.koi_care_system.models.Tag;
import com.swpproject.koi_care_system.payload.request.TagCreateRequest;
import com.swpproject.koi_care_system.payload.request.TagUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface TagMapper {

    @Mapping(target = "blogs", ignore = true)
    @Mapping(target = "tagId", ignore = true)
    Tag maptoTag(TagCreateRequest tagCreateRequest);

    TagDto maptoTagDto(Tag tag);

    @Mapping(target = "blogs", ignore = true)
    @Mapping(target = "tagId", ignore = true)
    void updateTag(@MappingTarget Tag tag, TagUpdateRequest tagUpdateRequest);
}