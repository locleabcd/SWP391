package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.SubscribePlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscribePlanRepository extends JpaRepository<SubscribePlan,Long> {
    SubscribePlan findSubscribePlanByUserProfileId(Long userProfileId);
}
