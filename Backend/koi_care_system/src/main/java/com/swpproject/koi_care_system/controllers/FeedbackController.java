package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.dto.FeedbackDto;
import com.swpproject.koi_care_system.payload.request.EditFeedbackRequest;
import com.swpproject.koi_care_system.payload.request.FeedbackCreateRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.feedback.IFeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/feedbacks")
public class FeedbackController {

    @Autowired
    private IFeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<ApiResponse> createFeedback(@RequestBody FeedbackCreateRequest request) {
        try{
            FeedbackDto createdFeedback = feedbackService.createFeedBack(request);
            return ResponseEntity.ok(new ApiResponse("Create Feedback success",createdFeedback));
        }catch (Exception e){
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse(e.getMessage(), null));
        }
    }
    @PutMapping
    public ResponseEntity<ApiResponse> editFeedback(@RequestBody EditFeedbackRequest request) {
        try{
            FeedbackDto updatedFeedback = feedbackService.editFeedback(request);
            return ResponseEntity.ok(new ApiResponse("Update success!",updatedFeedback));
        }catch (Exception e){
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }
    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse> getFeedbackByProductId(@PathVariable Long productId) {
        try{
            List<FeedbackDto> feedbacks = feedbackService.findFeedbackByProductId(productId);
            return ResponseEntity.ok(new ApiResponse("Found",feedbacks));
        }catch (Exception e){
            return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(new ApiResponse("Error",INTERNAL_SERVER_ERROR));
        }
    }
    @DeleteMapping("/feedback/{id}/delete")
    public ResponseEntity<ApiResponse> deleteFeedbackById(@PathVariable Long id){
        try{
            feedbackService.deleteFeedback(id);
            return ResponseEntity.ok(new ApiResponse("Delete success!",null));
        }catch (Exception e){
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(),null));
        }
    }
}
