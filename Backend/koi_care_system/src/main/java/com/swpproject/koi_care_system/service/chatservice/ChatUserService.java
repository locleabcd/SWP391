package com.swpproject.koi_care_system.service.chatservice;

import com.swpproject.koi_care_system.models.ChatUser;
import com.swpproject.koi_care_system.enums.ChatUserStatus;
import com.swpproject.koi_care_system.repository.ChatUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatUserService {
    private final ChatUserRepository repository;
    public void saveUser(ChatUser user){
        if(repository.findByNickname(user.getNickname())==null){
            user.setStatus(ChatUserStatus.ONLINE);
            repository.save(user);
        }else{
            ChatUser userTmp = repository.findByNickname(user.getNickname());
            userTmp.setStatus(ChatUserStatus.ONLINE);
            repository.save(userTmp);
        }

    }
    public void disconnect(ChatUser user){
        ChatUser storedUser = repository.findByNickname(user.getNickname());
        if(storedUser!=null){
            storedUser.setStatus(ChatUserStatus.OFFLINE);
            repository.save(storedUser);
        }
    }
    public List<ChatUser> findConnectedUsers(){
        return repository.findAllByStatus(ChatUserStatus.ONLINE);
    }
}
