package com.swpproject.koi_care_system.service.tag;

import com.swpproject.koi_care_system.dto.TagDto;
import com.swpproject.koi_care_system.payload.request.CreateTagRequest;
import com.swpproject.koi_care_system.payload.request.UpdateTagRequest;

import java.util.List;

public interface ITagService {

    TagDto createTag(CreateTagRequest request);

    TagDto updateTag(int id, UpdateTagRequest request);

    void deleteTag(int id);

    TagDto getTagById(int id);

    List<TagDto> getAllTags();
}
