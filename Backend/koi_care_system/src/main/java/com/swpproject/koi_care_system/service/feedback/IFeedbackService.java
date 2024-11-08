package com.swpproject.koi_care_system.service.feedback;

import com.swpproject.koi_care_system.dto.FeedbackDto;
import com.swpproject.koi_care_system.payload.request.EditFeedbackRequest;
import com.swpproject.koi_care_system.payload.request.FeedbackCreateRequest;

import java.util.List;

public interface IFeedbackService {
    FeedbackDto createFeedBack(FeedbackCreateRequest request);

    FeedbackDto editFeedback(EditFeedbackRequest request);

    List<FeedbackDto> findFeedbackByProductId(Long productID);

    void deleteFeedback(Long feedbackId);



}
