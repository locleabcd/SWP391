package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.IssueType;
import com.swpproject.koi_care_system.models.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryName(String category);

    List<Product> findByBrand(String brand);

    List<Product> findByCategoryNameAndBrand(String category, String brand);

    List<Product> findBySupplierName(String supplierName);
    List<Product> findByName(String name);

    List<Product> findByBrandAndName(String brand, String name);

    Long countByBrandAndName(String brand, String name);
    List<Product> findByIssues(IssueType issueType);
}