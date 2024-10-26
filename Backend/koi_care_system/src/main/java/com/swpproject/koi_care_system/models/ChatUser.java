package com.swpproject.koi_care_system.models;

import com.swpproject.koi_care_system.enums.ChatUserStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@NoArgsConstructor
@Entity
public class ChatUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nickname;
    @Enumerated(EnumType.STRING)
    private ChatUserStatus status;
}
