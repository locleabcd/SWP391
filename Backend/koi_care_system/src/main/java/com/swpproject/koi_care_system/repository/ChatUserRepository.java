package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.ChatUser;
import com.swpproject.koi_care_system.enums.ChatUserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatUserRepository extends JpaRepository<ChatUser,String> {
    ChatUser findByNickname(String nickName);
    List<ChatUser> findAllByStatus(ChatUserStatus status);
}
