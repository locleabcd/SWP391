package com.swpproject.koi_care_system.repository;


import com.swpproject.koi_care_system.dto.KoiPondDto;
import com.swpproject.koi_care_system.models.KoiPond;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface KoiPondRepository extends JpaRepository<KoiPond,Long> {
    KoiPond findKoiPondsById(Long id);

    List<KoiPond> findByUserId(Long userId);

    List<KoiPond> findKoiPondsByUserId(Long userId);
    boolean existsByNameAndUserId(String name, Long id);
}