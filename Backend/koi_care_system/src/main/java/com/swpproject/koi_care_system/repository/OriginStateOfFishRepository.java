package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.OriginStateOfFish;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OriginStateOfFishRepository extends JpaRepository<OriginStateOfFish,Long> {
    OriginStateOfFish findOriginStateOfFishByKoiFishId(Long koiFishId);
}
