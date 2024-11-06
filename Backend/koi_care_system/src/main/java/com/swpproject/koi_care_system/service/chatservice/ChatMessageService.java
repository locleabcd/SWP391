package com.swpproject.koi_care_system.service.chatservice;

import com.swpproject.koi_care_system.models.ChatMessage;
import com.swpproject.koi_care_system.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository repository;
    private final ChatRoomService chatRoomService;
    public ChatMessage save(ChatMessage chatMessage){
        String chatId="";
        if(chatMessage.getRecipientId().equals("SupportService") && !repository.findChatMessageBySenderId(chatMessage.getSenderId()).isEmpty()){
            chatId =chatRoomService.getChatRoomIdBySenderId(chatMessage.getSenderId(),false).orElseThrow();
            if(!chatId.isEmpty())
                chatMessage.setRecipientId(chatId.substring(chatId.indexOf('_')+1));
        }else {
            chatId = chatRoomService.getChatRoomId(
                    chatMessage.getSenderId(), chatMessage.getRecipientId(), true).orElseThrow();
        }
        chatMessage.setChatId(chatId);
        chatMessage.setTimestamp(LocalDateTime.now().toString());
        return repository.save(chatMessage);
    }
    public List<ChatMessage> findChatMessage(String senderId, String recipientId){
        var chatId = chatRoomService.getChatRoomId(senderId,recipientId,false);
        return chatId.map(repository::findByChatId).orElse(new ArrayList<>());
    }
    public List<ChatMessage> findChatMessage(String senderId){
        var chatId = chatRoomService.getChatRoomIdBySenderId(senderId,false);
        return chatId.map(repository::findByChatId).orElse(new ArrayList<>());
    }
    public void updateRecipientInchat(String userId, String shopId){
        var chatId = chatRoomService.getChatRoomId(userId,"SupportService",false);
        chatRoomService.updateChatRoom(userId,shopId,"SupportService");
        chatId.map(repository::findByChatId).ifPresent((chatMessages -> {
             chatMessages.forEach(chatMessage -> {
                 if(chatMessage.getRecipientId().equals("SupportService"))
                     chatMessage.setRecipientId(shopId);
                 else if(chatMessage.getSenderId().equals("SupportService"))
                     chatMessage.setSenderId(shopId);
                 chatMessage.setChatId(String.format("%s_%s",userId,shopId));
             });
             repository.saveAll(chatMessages);
         }));
        return;
    }

    public void backRecipientInChat(String userId){
        var chatId = chatRoomService.getChatRoomIdBySenderId(userId,false);
        chatRoomService.backDefaultChatRoom(userId,"SupportService");
        chatId.map(repository::findByChatId).ifPresent((chatMessages -> {
            chatMessages.forEach(chatMessage -> {
                if(!chatMessage.getRecipientId().equals(userId))
                    chatMessage.setRecipientId("SupportService");
                else
                    chatMessage.setSenderId("SupportService");
                chatMessage.setChatId(String.format("%s_%s",userId,"SupportService"));
            });
            repository.saveAll(chatMessages);
        }));
    }
}
