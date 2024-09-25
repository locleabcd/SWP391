package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.BlogDto;
import com.swpproject.koi_care_system.models.Blog;
import com.swpproject.koi_care_system.payload.request.BlogCreateRequest;
import com.swpproject.koi_care_system.payload.request.BlogUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface BlogMapper {
    @Mapping(target = "tags", ignore = true)
    @Mapping(target = "blogDate", ignore = true)
    @Mapping(target = "user", ignore = true)
    Blog mapToBlog(BlogCreateRequest request);

    BlogDto mapToBlogDto(Blog blog);

    @Mapping(target = "tags", ignore = true)
    @Mapping(target = "user", ignore = true)
    void updateBlog(@MappingTarget Blog blog, BlogUpdateRequest request);

}
