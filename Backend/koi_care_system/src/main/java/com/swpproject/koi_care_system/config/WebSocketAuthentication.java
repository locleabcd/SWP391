package com.swpproject.koi_care_system.config;

import com.swpproject.koi_care_system.utils.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class WebSocketAuthentication implements ChannelInterceptor {

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String token = accessor.getFirstNativeHeader("Authorization");

            if (token != null && token.startsWith("Bearer ")) {
                token = token.substring(7); // Remove "Bearer " prefix
                try {
                    String username = jwtUtils.getUsernameFromToken(token);

                    if (username != null && jwtUtils.verificationToken(token)) {
                        // Create an authentication token with the username and set it in the accessor
                        accessor.setUser(new UsernamePasswordAuthenticationToken(username, null, List.of()));
                    }
                } catch (Exception e) {
                    // Log the exception or handle as needed
                    System.out.println("Token validation failed: " + e.getMessage());
                }
            }
        }
        return message;
    }
}
