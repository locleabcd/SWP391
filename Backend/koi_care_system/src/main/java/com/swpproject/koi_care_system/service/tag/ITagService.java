package com.swpproject.koi_care_system.service.tag;

import com.swpproject.koi_care_system.dto.TagDto;
import com.swpproject.koi_care_system.payload.request.TagCreateRequest;
import com.swpproject.koi_care_system.payload.request.TagUpdateRequest;

import java.util.List;

public interface ITagService {

    TagDto createTag(TagCreateRequest request);

    TagDto updateTag(int id, TagUpdateRequest request);

    void deleteTag(int id);

    TagDto getTagById(int id);

    List<TagDto> getAllTags();
}
