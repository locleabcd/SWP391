package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.IssueType;
import com.swpproject.koi_care_system.models.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryName(String category);

    List<Product> findByBrand(String brand);

    List<Product> findByCategoryNameAndBrand(String category, String brand);

    List<Product> findBySupplierName(String supplierName);
    List<Product> findByName(String name);

    @Query("SELECT p FROM Product p WHERE p.status = true")
    Page<Product> findAllAvailable(Pageable pageable);

    List<Product> findByBrandAndName(String brand, String name);

    Long countByBrandAndName(String brand, String name);
    List<Product> findByIssues(IssueType issueType);
}