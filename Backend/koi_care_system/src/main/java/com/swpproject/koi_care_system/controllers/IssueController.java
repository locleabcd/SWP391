package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.issue.IIssueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/issues")
@RequiredArgsConstructor
public class IssueController {
    private final IIssueService issueService;

    @GetMapping("/all/{waterParametersId}")
    public ResponseEntity<ApiResponse> getAllIssues(@PathVariable Long waterParametersId) {
        return ResponseEntity.ok(ApiResponse.builder()
                .message("All issues from water parameters")
                .data(issueService.getIssue(waterParametersId))
                .build());
    }
}