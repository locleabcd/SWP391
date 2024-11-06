package com.swpproject.koi_care_system.service.tag;

import com.swpproject.koi_care_system.dto.TagDto;
import com.swpproject.koi_care_system.enums.ErrorCode;
import com.swpproject.koi_care_system.exceptions.AppException;
import com.swpproject.koi_care_system.mapper.TagMapper;
import com.swpproject.koi_care_system.models.Blog;
import com.swpproject.koi_care_system.models.Tag;
import com.swpproject.koi_care_system.payload.request.TagCreateRequest;
import com.swpproject.koi_care_system.payload.request.TagUpdateRequest;
import com.swpproject.koi_care_system.repository.BlogRepository;
import com.swpproject.koi_care_system.repository.TagRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@PreAuthorize("hasRole('ADMIN') or hasRole('SHOP')")
public class TagService implements ITagService {

    TagRepository tagRepository;
    TagMapper tagMapper;
    private final BlogRepository blogRepository;

    @Override
    public TagDto createTag(TagCreateRequest request) {
        if (tagRepository.existsByTagName(request.getTagName())) {
            throw new AppException(ErrorCode.TAG_EXISTED);
        } else if (tagRepository.existsByTagDescription(request.getTagDescription())) {
            throw new AppException(ErrorCode.TAG_DESCRIPTION_EXISTED);
        }
        Tag tag = tagMapper.maptoTag(request);
        return tagMapper.maptoTagDto(tagRepository.save(tag));
    }

    @Override
    public TagDto updateTag(int id, TagUpdateRequest request) {
        Tag tag = tagRepository.findById(id).orElseThrow(() -> new RuntimeException("Tag not found"));
        tagMapper.updateTag(tag, request);
        return tagMapper.maptoTagDto(tagRepository.save(tag));

    }

    @Override
    public void deleteTag(int id) {
        Tag tag = tagRepository.findById(id).orElseThrow(() -> new RuntimeException("Tag not found"));
        for (Blog blog : tag.getBlogs()) {
            blog.getTags().remove(tag);
            if (blog.getTags().isEmpty()) {
                blogRepository.delete(blog);
            } else blogRepository.save(blog);
        }
        tagRepository.delete(tag);
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
