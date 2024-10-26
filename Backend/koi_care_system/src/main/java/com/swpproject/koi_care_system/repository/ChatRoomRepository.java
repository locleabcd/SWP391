package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom,String> {
    Optional<ChatRoom> findBySenderIdAndRecipientId(String senderId, String recipientId);
    Optional<ChatRoom> findBySenderId(String senderID);
}
