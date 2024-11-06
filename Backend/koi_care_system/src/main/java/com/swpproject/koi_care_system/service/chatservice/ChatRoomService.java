package com.swpproject.koi_care_system.service.chatservice;

import com.swpproject.koi_care_system.models.ChatRoom;
import com.swpproject.koi_care_system.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatRoomRepository repository;
    public Optional<String> getChatRoomId(
            String senderId,
            String recipientId,
            boolean createNewRoomIfNotExists
    ){
        return repository.findBySenderIdAndRecipientId(senderId,recipientId)
                .map(ChatRoom::getChatId)
                .or(()->{
                    if(createNewRoomIfNotExists){
                           String chatroomId = createChatRoomId(senderId,recipientId);
                           return Optional.of(chatroomId);
                    }
                    return Optional.empty();
                });
    }
    public void updateChatRoom(String userId,String staffId,String defaultShop){
        repository.findBySenderIdAndRecipientId(userId, defaultShop)
                .ifPresent(chatRoom -> {
                    chatRoom.setRecipientId(staffId);
                    chatRoom.setChatId(String.format("%s_%s",userId,staffId));
                    repository.save(chatRoom);
                });
        repository.findBySenderIdAndRecipientId(defaultShop,userId)
                .ifPresent(chatRoom -> {
                    chatRoom.setSenderId(staffId);
                    chatRoom.setChatId(String.format("%s_%s",userId,staffId));
                    repository.save(chatRoom);
                });
    }

    public void backDefaultChatRoom(String userId,String defaultShop){
        repository.findBySenderId(userId)
                .ifPresent(chatRoom -> {
                    repository.findBySenderIdAndRecipientId(chatRoom.getRecipientId(),userId)
                            .ifPresent(chatRooms -> {
                                chatRooms.setSenderId(defaultShop);
                                chatRooms.setChatId(String.format("%s_%s",userId,defaultShop));
                                repository.save(chatRooms);
                            });
                    chatRoom.setRecipientId(defaultShop);
                    chatRoom.setChatId(String.format("%s_%s",userId,defaultShop));
                    repository.save(chatRoom);
                });
    }




    public Optional<String> getChatRoomIdBySenderId(
            String senderId,
            boolean createNewRoomIfNotExists
    ){
        return repository.findBySenderId(senderId)
                .map(ChatRoom::getChatId)
                .or(()->{
                    if(createNewRoomIfNotExists){
                        String chatroomId = createChatRoomId(senderId,"SupportService");
                        return Optional.of(chatroomId);
                    }
                    return Optional.empty();
                });
    }

    private String createChatRoomId(String senderId, String recipientId) {
        String chatRoomId = String.format("%s_%s",senderId,recipientId);
        ChatRoom  senderRecipient = ChatRoom.builder()
                .chatId(chatRoomId)
                .senderId(senderId)
                .recipientId(recipientId)
                .build();
        ChatRoom  recipientSender = ChatRoom.builder()
                .chatId(chatRoomId)
                .senderId(recipientId)
                .recipientId(senderId)
                .build();
        repository.save(senderRecipient);
        repository.save(recipientSender);

        return chatRoomId;
    }
}
