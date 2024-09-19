package com.swpproject.koi_care_system.payload.request;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BlogUpdateRequest {

    String blogTitle;
    String blogContent;
    String blogImage;
    String blogDate;
    Set<Integer> tagIds;
}
