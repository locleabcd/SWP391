package com.swpproject.koi_care_system.service.Blog;

import com.swpproject.koi_care_system.dto.BlogDto;
import com.swpproject.koi_care_system.mapper.BlogMapper;
import com.swpproject.koi_care_system.models.Blog;
import com.swpproject.koi_care_system.models.Tag;
import com.swpproject.koi_care_system.payload.request.BlogCreateRequest;
import com.swpproject.koi_care_system.payload.request.BlogUpdateRequest;
import com.swpproject.koi_care_system.repository.BlogRepository;
import com.swpproject.koi_care_system.repository.TagRepository;
import com.swpproject.koi_care_system.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BlogService implements IBlogService {
    BlogRepository blogRepository;
    BlogMapper blogMapper;
    UserRepository userRepository;
    TagRepository tagRepository;

    @Override
    public BlogDto createBlog(BlogCreateRequest blogCreateRequest, String username) {
        if (blogRepository.existsByBlogTitle(blogCreateRequest.getBlogTitle())) {
            throw new RuntimeException("Blog already exists");
        }
        Blog blog = blogMapper.mapToBlog(blogCreateRequest);
        blog.setBlogImage("default.jpg");
        blog.setBlogDate(java.util.Calendar.getInstance().getTime());

        Set<Tag> tags = new HashSet<>();
        for (int tagId : blogCreateRequest.getTagIds()) {
            Tag tag = tagRepository.findById(tagId).orElseThrow(() -> new RuntimeException("Tag not found"));
            tags.add(tag);
        }
        blog.setTags(tags);
        blog.setUser(userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found")));

        return blogMapper.mapToBlogDto(blogRepository.save(blog));

    }

    @Override
    public BlogDto updateBlog(int id, BlogUpdateRequest blogUpdateRequest) {
        Blog blog = blogRepository.findById(id).orElseThrow(() -> new RuntimeException("Blog not found"));
        blogMapper.updateBlog(blog, blogUpdateRequest);
        return blogMapper.mapToBlogDto(blogRepository.save(blog));
    }

    @Override
    public void deleteBlog(int id) {
        blogRepository.findById(id).ifPresentOrElse(blogRepository::delete, () -> {
            throw new RuntimeException("Blog not found");
        });
    }

    @Override
    public List<BlogDto> getAllBlogs() {
        return blogRepository.findAll().stream().map(blogMapper::mapToBlogDto).toList();
    }

    @Override
    public BlogDto getBlogById(int id) {
        return blogRepository.findById(id).map(blogMapper::mapToBlogDto).orElseThrow(() -> new RuntimeException("Blog not found"));
    }

    @Override
    public List<BlogDto> getBlogByTag(String tagName) {
        List<Blog> blogs = blogRepository.findByTags_TagName(tagName);
        return blogs.stream().map(blogMapper::mapToBlogDto).toList();
    }

    @Override
    public List<BlogDto> getBlogByUsername(String username) {
        List<Blog> blogs = blogRepository.findByUser_username(username);
        return blogs.stream().map(blogMapper::mapToBlogDto).toList();
    }

    @Override
    public List<BlogDto> searchBlogs(String keyword) {
        return List.of();
    }
}
