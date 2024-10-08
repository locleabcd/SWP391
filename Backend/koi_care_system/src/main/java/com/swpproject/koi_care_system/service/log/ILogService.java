package com.swpproject.koi_care_system.service.log;

import com.swpproject.koi_care_system.dto.LogDto;
import com.swpproject.koi_care_system.payload.request.LogCreateRequest;
import com.swpproject.koi_care_system.payload.request.LogUpdateRequest;

import java.util.List;

public interface ILogService {
    LogDto createLog(LogCreateRequest request, long pondId);

    LogDto updateLog(int logId, LogUpdateRequest request);

    void deleteLog(int logId);

    LogDto getLogById(int logId);

    List<LogDto> getAllLogs(String sortBy, String sortDir);

    List<LogDto> getLogsByPondId(long pondId);

    List<LogDto> getLogsByUserId(Long userId);

    List<LogDto> getLogsByCategory(String category);


}