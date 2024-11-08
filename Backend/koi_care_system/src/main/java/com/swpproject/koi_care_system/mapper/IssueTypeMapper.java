package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.IssueTypeDto;
import com.swpproject.koi_care_system.models.IssueType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface IssueTypeMapper {
    IssueTypeDto maptodto(IssueType issueType);
}
