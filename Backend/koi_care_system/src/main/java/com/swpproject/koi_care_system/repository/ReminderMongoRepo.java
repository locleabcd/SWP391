package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.ReminderMongo;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReminderMongoRepo extends MongoRepository<ReminderMongo, Long> {
    @Query("{ 'dateTime': { $gte: ?0, $lt: ?1 } }")
    List<ReminderMongo> findDueRemindersBetween(String startTime, String endTime);

    List<ReminderMongo> findByDateTimeBetween(String startTime, String endTime);

}
