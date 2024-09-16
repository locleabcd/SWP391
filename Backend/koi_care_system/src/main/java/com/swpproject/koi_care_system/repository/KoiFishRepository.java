package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.KoiFish;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KoiFishRepository extends JpaRepository<KoiFish,Long> {
    List<KoiFish> getKoiFishById(Long fishId);
}
