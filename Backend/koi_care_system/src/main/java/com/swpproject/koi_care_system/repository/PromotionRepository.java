package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.enums.PromotionStatus;
import com.swpproject.koi_care_system.models.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    boolean existsByName(String promotionName);

    List<Promotion> findPromotionByStatus(PromotionStatus status);

    Promotion findPromotionById(Long promotionId);


}