package com.swpproject.koi_care_system.service.feedback;

import com.swpproject.koi_care_system.dto.FeedbackDto;
import com.swpproject.koi_care_system.models.Feedback;
import com.swpproject.koi_care_system.models.Product;
import com.swpproject.koi_care_system.models.User;
import com.swpproject.koi_care_system.payload.request.EditFeedbackRequest;
import com.swpproject.koi_care_system.payload.request.FeedbackCreateRequest;
import com.swpproject.koi_care_system.repository.FeedbackRepository;
import com.swpproject.koi_care_system.repository.ProductRepository;
import com.swpproject.koi_care_system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService implements IFeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public FeedbackDto createFeedBack(FeedbackCreateRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Feedback feedback = new Feedback();
        feedback.setStar(request.getStar());
        feedback.setComment(request.getComment());
        feedback.setUser(user);
        feedback.setProduct(product);

        Feedback savedFeedback = feedbackRepository.save(feedback);
        return convertToDto(savedFeedback);
    }

    @Override
    public FeedbackDto editFeedback(EditFeedbackRequest request) {
        Feedback feedback = feedbackRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        feedback.setStar(request.getStar());
        feedback.setComment(request.getComment());

        Feedback updatedFeedback = feedbackRepository.save(feedback);
        return convertToDto(updatedFeedback);
    }

    @Override
    public List<FeedbackDto> findFeedbackByProductId(Long productId) {
        List<Feedback> feedbacks = feedbackRepository.findFeedbackByProductId(productId);
        return feedbacks.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }
    @Override
    public void deleteFeedback(Long feedbackId) {
        feedbackRepository.findById(feedbackId).ifPresentOrElse(feedbackRepository::delete,()->{
            throw new RuntimeException("Feedback not found");
        });
    }

    private FeedbackDto convertToDto(Feedback feedback) {
        FeedbackDto dto = new FeedbackDto();
        dto.setId(feedback.getId());
        dto.setStar(feedback.getStar());
        dto.setComment(feedback.getComment());
        dto.setUsername(feedback.getUser().getUsername());
        dto.setProduct_id(feedback.getProduct().getId());
        return dto;
    }
}
