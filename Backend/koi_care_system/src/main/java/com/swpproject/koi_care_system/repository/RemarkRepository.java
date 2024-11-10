package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.Remark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RemarkRepository extends JpaRepository<Remark, Long> {
    @Query("SELECT r FROM Remark r WHERE r.koiFish.id = :koiFishId ORDER BY r.createDate DESC")
    List<Remark> findAllByKoiFishId(Long koiFishId);
}