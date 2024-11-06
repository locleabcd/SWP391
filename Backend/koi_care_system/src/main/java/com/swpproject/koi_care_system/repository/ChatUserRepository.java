package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.ChatUser;
import com.swpproject.koi_care_system.enums.ChatUserStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChatUserRepository extends MongoRepository<ChatUser,String> {
    ChatUser findByNickname(String nickName);
    List<ChatUser> findAllByStatus(ChatUserStatus status);
}
