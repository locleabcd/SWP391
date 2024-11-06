package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.payload.request.TagCreateRequest;
import com.swpproject.koi_care_system.payload.request.TagUpdateRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.tag.ITagService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/tag")
@RequiredArgsConstructor
public class TagController {
    private final ITagService tagService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse> createTag(@RequestBody TagCreateRequest tagCreateRequest) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.builder()
                .message("Tag has been created")
                .data(tagService.createTag(tagCreateRequest))
                .build());
    }

    @PutMapping("/update/{tagId}")
    public ResponseEntity<ApiResponse> updateTag(@PathVariable int tagId, @RequestBody @Valid TagUpdateRequest tagUpdateRequest) {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Tag has been updated")
                .data(tagService.updateTag(tagId, tagUpdateRequest))
                .build());
    }

    @GetMapping("/getID/{tagId}")
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

    @DeleteMapping("/delete/{tagId}")
    public ResponseEntity<ApiResponse> deleteTag(@PathVariable int tagId) {
        tagService.deleteTag(tagId);
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Tag has been deleted")
                .build());
    }


}