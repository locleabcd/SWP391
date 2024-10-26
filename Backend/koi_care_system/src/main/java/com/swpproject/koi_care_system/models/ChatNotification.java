package com.swpproject.koi_care_system.models;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class ChatNotification {
    private Long id;
    private String senderId;
    private String recipientId;
    private String content;
}