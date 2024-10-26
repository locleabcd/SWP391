package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage,String> {
    List<ChatMessage> findByChatId(String chatId);
    List<ChatMessage> findChatMessageBySenderId(String senderId);
}
