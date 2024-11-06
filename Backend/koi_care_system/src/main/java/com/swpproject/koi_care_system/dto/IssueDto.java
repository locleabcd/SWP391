package com.swpproject.koi_care_system.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class IssueDto {
    Long id;
    String name;
    String description;
    Long issueTypeId;
}