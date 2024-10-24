package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificaitonRepository extends JpaRepository<Notification, Long> {
    List<Notification> findAllByUserId(long userId);

    List<Notification> findByUserIdAndDeliveredFalse(Long userId);
}
