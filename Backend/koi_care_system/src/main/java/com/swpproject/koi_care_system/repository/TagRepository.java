package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TagRepository extends JpaRepository<Tag, Integer> {
    boolean existsByTagName(String tagName);

    boolean existsByTagDescription(String tagDescription);

}
