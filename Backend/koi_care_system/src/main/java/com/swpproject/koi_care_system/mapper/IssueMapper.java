package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.IssueDto;
import com.swpproject.koi_care_system.models.Issue;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface IssueMapper {

    @Mapping(target = "issueTypeId", source = "issueType.id")
    IssueDto mapToIssueDto(Issue issue);

}