package com.swpproject.koi_care_system.repository;


import com.swpproject.koi_care_system.models.KoiPond;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface KoiPondRepository extends JpaRepository<KoiPond,Long> {

    boolean existsByName(String name);

    KoiPond findKoiPondsById(Long id);

    Optional<List<KoiPond>> findByUserId(Long userId);

    @Query("SELECT COUNT(kf) FROM KoiFish kf WHERE kf.koiPond.id = :pondId")
    Integer countKoiFishByPondId(@Param("pondId") Long pondId);

    boolean existsByNameAndUserId(String name, Long id);
}