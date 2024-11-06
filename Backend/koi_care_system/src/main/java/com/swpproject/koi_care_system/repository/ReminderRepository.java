package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    @Query("SELECT r FROM Reminder r WHERE HOUR(r.dateTime) = HOUR(:currentTime) AND MINUTE(r.dateTime) = MINUTE(:currentTime)")
    List<Reminder> findDueRemindersAtTime(@Param("currentTime") LocalDateTime currentTime);

    List<Reminder> findByUserId(Long userid);
}
