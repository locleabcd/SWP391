package com.swpproject.koi_care_system.service.tag;

import com.swpproject.koi_care_system.dto.TagDto;
import com.swpproject.koi_care_system.enums.ErrorCode;
import com.swpproject.koi_care_system.exceptions.AppException;
import com.swpproject.koi_care_system.mapper.TagMapper;
import com.swpproject.koi_care_system.models.Tag;
import com.swpproject.koi_care_system.payload.request.CreateTagRequest;
import com.swpproject.koi_care_system.payload.request.UpdateTagRequest;
import com.swpproject.koi_care_system.repository.TagRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class TagService implements ITagService {

    TagRepository tagRepository;
    TagMapper tagMapper;

    @Override
    public TagDto createTag(CreateTagRequest request) {
        if (tagRepository.existsByTagName(request.getTagName())) {
            throw new AppException(ErrorCode.TAG_EXISTED);
        }
        Tag tag = tagMapper.maptoTag(request);
        tag.setTagName(request.getTagName());

        return tagMapper.maptoTagDto(tagRepository.save(tag));
    }

    @Override
    public TagDto updateTag(int id, UpdateTagRequest request) {
        Tag tag = tagRepository.findById(id).orElseThrow(() -> new RuntimeException("Tag not found"));
        tagMapper.updateTag(tag, request);
        return tagMapper.maptoTagDto(tagRepository.save(tag));

    }

    @Override
    public void deleteTag(int id) {
        tagRepository.findById(id).ifPresentOrElse(tagRepository::delete, () -> {
            throw new RuntimeException("Tag not found");
        });
    }

    @Override
    public TagDto getTagById(int id) {
        return tagMapper.maptoTagDto(tagRepository.findById(id).orElseThrow(() -> new RuntimeException("Tag not found")));
    }

    @Override
    public List<TagDto> getAllTags() {
        return tagRepository.findAll().stream().map(tagMapper::maptoTagDto).toList();
    }
}
