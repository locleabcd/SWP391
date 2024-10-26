package com.swpproject.koi_care_system.service.chatservice;

import com.swpproject.koi_care_system.models.ChatMessage;
import com.swpproject.koi_care_system.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
            System.out.println("Access to already update service" + chatId +"   " + chatMessage.getSenderId() + "    " + chatMessage.getRecipientId());
            if(!chatId.isEmpty())
                chatMessage.setRecipientId(chatId.substring(chatId.indexOf('_')+1));
        }else {
            chatId = chatRoomService.getChatRoomId(
                    chatMessage.getSenderId(), chatMessage.getRecipientId(), true).orElseThrow();
            System.out.println("Access to bad response" + chatId +"   " + chatMessage.getSenderId() + "    " + chatMessage.getRecipientId());

        }
        chatMessage.setChatId(chatId);
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
                 chatMessage.setRecipientId(shopId);
                 chatMessage.setChatId(String.format("%s_%s",userId,shopId));
             });
             repository.saveAll(chatMessages);
         }));
        return;
    }
}