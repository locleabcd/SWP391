package com.swpproject.koi_care_system.dto;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.util.Date;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlogDto {

    String blogTitle;
    String blogContent;
    String blogImage;
    Date blogDate;
    UserDTO user;
    Set<TagDto> tags;

}
