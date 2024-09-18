package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {
    List<Image> findByProductId(Long id);
    Image findByKoiPondId(Long id);

    Image findByKoiFishId(Long id);
}
