package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.payload.request.CreateTagRequest;
import com.swpproject.koi_care_system.payload.request.UpdateTagRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.tag.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tag")
@RequiredArgsConstructor
public class TagController {
    private final TagService tagService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createTag(@RequestBody CreateTagRequest createTagRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.builder()
                .message("Tag has been created")
                .data(tagService.createTag(createTagRequest))
                .build());
    }

    @PutMapping("/{tagId}")
    public ResponseEntity<ApiResponse> updateTag(@PathVariable int tagId, @RequestBody UpdateTagRequest updateTagRequest) {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Tag has been updated")
                .data(tagService.updateTag(tagId, updateTagRequest))
                .build());
    }

    @GetMapping("/{tagId}")
    public ResponseEntity<ApiResponse> getTagById(@PathVariable int tagId) {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Tag found")
                .data(tagService.getTagById(tagId))
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse> getAllTags() {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("List of tags")
                .data(tagService.getAllTags())
                .build());
    }

    @DeleteMapping("/{tagId}")
    public ResponseEntity<ApiResponse> deleteTag(@PathVariable int tagId) {
        tagService.deleteTag(tagId);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Tag has been deleted")
                .build());
    }


}
