package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier,Long> {
    Supplier findByName(String name);
    boolean existsByName(String name);
}