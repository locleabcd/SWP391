package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
  Category findByName(String name);

  boolean existsByName(String name);
}
