package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage,String> {
    List<ChatMessage> findByChatId(String chatId);
    List<ChatMessage> findChatMessageBySenderId(String senderId);
}
