package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findFeedbackByProductId(Long productId);
}
