package com.swpproject.koi_care_system.models;

import com.swpproject.koi_care_system.enums.ChatUserStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@NoArgsConstructor
@Document
public class ChatUser {
    @Id
    private String id;
    private String nickname;
    @Enumerated(EnumType.STRING)
    private ChatUserStatus status;
}
