package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.models.ChatUser;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.chatservice.ChatUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class ChatUserController {
    private final ChatUserService service;

    @MessageMapping("/user.addUser")
    @SendTo("/user/public")
    public ChatUser addUser(
            @Payload ChatUser user
    ) {
        service.saveUser(user);
        return user;
    }
    @MessageMapping("/user.disconnectUser")
    @SendTo("/user/public")
    public ChatUser disconnect(
            @Payload ChatUser user
    ){
        service.disconnect(user);
        return user;
    }

    @GetMapping("/chatUserOnlines")
    public ResponseEntity<ApiResponse> findConnectedUsers(){
        return ResponseEntity.ok(ApiResponse.builder().message("Get list user online success").data(service.findConnectedUsers()).build());
    }
}
