package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ChatRoomRepository extends MongoRepository<ChatRoom,String> {
    Optional<ChatRoom> findBySenderIdAndRecipientId(String senderId, String recipientId);
    Optional<ChatRoom> findBySenderId(String senderID);
}
