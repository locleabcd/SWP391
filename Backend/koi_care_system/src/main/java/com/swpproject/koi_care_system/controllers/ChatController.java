package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.models.ChatMessage;
import com.swpproject.koi_care_system.models.ChatNotification;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.chatservice.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
public class ChatController {
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final ChatMessageService chatMessageService;

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        ChatMessage savedMsg = chatMessageService.save(chatMessage);
        simpMessagingTemplate.convertAndSendToUser(
                chatMessage.getRecipientId(), "/queue/messages",
                new ChatNotification(
                        savedMsg.getId(),
                        savedMsg.getSenderId(),
                        savedMsg.getRecipientId(),
                        savedMsg.getContent()
                )
        );
    }
    @GetMapping("/messages/{senderId}/{recipientId}")
    public ResponseEntity<ApiResponse> findChatMessage(@PathVariable("senderId") String senderId,@PathVariable("recipientId") String recipientId ){
        return ResponseEntity.ok(ApiResponse.builder().message("Find message success").data(chatMessageService.findChatMessage(senderId,recipientId)).build());
    }
    @GetMapping("/messages/{senderId}")
    public ResponseEntity<ApiResponse> findChatMessageWithShop(@PathVariable("senderId") String senderId){
        return ResponseEntity.ok(ApiResponse.builder().message("Find message success").data(chatMessageService.findChatMessage(senderId)).build());
    }

    @GetMapping("/messages/{userId}/{shopId}/update")
    public ResponseEntity<ApiResponse> updateUserInChat(@PathVariable("userId") String userId,@PathVariable("shopId") String shopId ){
        chatMessageService.updateRecipientInchat(userId,shopId);
        return ResponseEntity.ok(ApiResponse.builder().message("Update success").build());
    }
    @GetMapping("/messages/{userId}/defaultRoom")
    public ResponseEntity<ApiResponse> backToDefault(@PathVariable("userId") String userId){
        chatMessageService.backRecipientInChat(userId);
        return ResponseEntity.ok(ApiResponse.builder().message("Update success").build());
    }

}
