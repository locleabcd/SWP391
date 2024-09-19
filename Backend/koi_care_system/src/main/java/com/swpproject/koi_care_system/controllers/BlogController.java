package com.swpproject.koi_care_system.controllers;

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
    public ResponseEntity<ApiResponse> getAllBlogs() {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("List of blogs")
                .data(blogService.getAllBlogs())
                .build());
    }

    @DeleteMapping("/delete/{blogId}")
    public ResponseEntity<ApiResponse> deleteBlog(@PathVariable int blogId) {
        blogService.deleteBlog(blogId);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Blog has been deleted")
                .build());
    }

    @GetMapping("/getByUser")
    public ResponseEntity<ApiResponse> getBlogsByUser(String username) {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("List of blogs")
                .data(blogService.getBlogByUsername(username))
                .build());
    }

    @GetMapping("/getByTag")
    public ResponseEntity<ApiResponse> getBlogsByTag(String tagName) {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("List of blogs")
                .data(blogService.getBlogByTag(tagName))
                .build());
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchBlogs(String keyword) {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("List of blogs")
                .data(blogService.searchBlogs(keyword))
                .build());
    }


}
