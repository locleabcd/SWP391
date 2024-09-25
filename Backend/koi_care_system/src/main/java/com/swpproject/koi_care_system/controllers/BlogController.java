package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.dto.BlogDto;
import com.swpproject.koi_care_system.payload.request.BlogCreateRequest;
import com.swpproject.koi_care_system.payload.request.BlogUpdateRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.Blog.IBlogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/blog")
@RequiredArgsConstructor
public class BlogController {

    private final IBlogService blogService;


    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createBlog(@RequestBody @Valid BlogCreateRequest blogCreateRequest, Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.builder()
                .data(blogService.createBlog(blogCreateRequest, username))
                .message("Blog has been created")
                .build());
    }

    @PutMapping("/update/{blogId}")
    public ResponseEntity<ApiResponse> updateBlog(@PathVariable int blogId, @RequestBody @Valid BlogUpdateRequest blogUpdateRequest) {
        return ResponseEntity.ok(ApiResponse.builder()
                .data(blogService.updateBlog(blogId, blogUpdateRequest))
                .message("Blog has been updated")
                .build());
    }

    @GetMapping("/getID/{blogId}")
    public ResponseEntity<ApiResponse> getBlogById(@PathVariable int blogId) {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Blog found")
                .data(blogService.getBlogById(blogId))
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllBlogs(@RequestParam(defaultValue = "0") int pageNumber,
                                                   @RequestParam(defaultValue = "10") int pageSize,
                                                   @RequestParam(defaultValue = "blogDate") String sortBy,
                                                   @RequestParam(defaultValue = "Asc") String sortDir) {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("List of blogs")
                .data(blogService.getAllBlogs(pageNumber, pageSize, sortBy, sortDir))
                .build());
    }

    @DeleteMapping("/delete/{blogId}")
    public ResponseEntity<ApiResponse> deleteBlog(@PathVariable int blogId) {
        blogService.deleteBlog(blogId);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Blog has been deleted")
                .build());
    }

    @GetMapping("/getByUser/{userId}")
    public ResponseEntity<ApiResponse> getBlogsByUser(@PathVariable long userId) {
        List<BlogDto> blogDtos = blogService.getBlogByUsername(userId);
        if (blogDtos.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.builder()
                    .message("No blogs found")
                    .build());
        }
        return ResponseEntity.ok(ApiResponse.builder()
                .message("List of blogs")
                .data(blogDtos)
                .build());
    }

    @GetMapping("/getByTag/{tagId}")
    public ResponseEntity<ApiResponse> getBlogsByTag(@PathVariable int tagId) {
        List<BlogDto> blogDtos = blogService.getBlogByTag(tagId);
        if (blogDtos.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.builder()
                    .message("No blogs found")
                    .build());
        }
        return ResponseEntity.ok(ApiResponse.builder()
                .message("List of blogs")
                .data(blogDtos)
                .build());
    }

    @GetMapping("/search/{keyword}")
    public ResponseEntity<ApiResponse> searchBlogs(@PathVariable String keyword) {
        List<BlogDto> blogDtos = blogService.searchBlogs(keyword);
        if (blogDtos.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(ApiResponse.builder()
                    .message("No blogs found")
                    .build());
        }
        return ResponseEntity.ok(ApiResponse.builder()
                .message("List of blogs")
                .data(blogDtos)
                .build());
    }


}