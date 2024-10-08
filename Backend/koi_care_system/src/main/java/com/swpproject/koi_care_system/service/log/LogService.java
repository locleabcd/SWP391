package com.swpproject.koi_care_system.service.log;

import com.swpproject.koi_care_system.dto.LogDto;
import com.swpproject.koi_care_system.enums.LogCategory;
import com.swpproject.koi_care_system.mapper.LogMapper;
import com.swpproject.koi_care_system.models.KoiPond;
import com.swpproject.koi_care_system.models.Log;
import com.swpproject.koi_care_system.payload.request.LogCreateRequest;
import com.swpproject.koi_care_system.payload.request.LogUpdateRequest;
import com.swpproject.koi_care_system.repository.KoiPondRepository;
import com.swpproject.koi_care_system.repository.LogRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LogService implements ILogService {
    LogMapper logMapper;
    LogRepository logRepository;
    KoiPondRepository koiPondRepository;

    @Override
    public LogDto createLog(LogCreateRequest request, long pondId) {
        KoiPond koiPond = koiPondRepository.findById(pondId).orElseThrow(() -> new RuntimeException("Pond not found"));
        Log log = logMapper.mapToLog(request);
        log.setKoiPond(koiPond);
        return logMapper.mapToLogDto(logRepository.save(log));
    }

    @Override
    public LogDto updateLog(int logId, LogUpdateRequest request) {
        Log log = logRepository.findById(logId).orElseThrow(() -> new RuntimeException("Log not found"));
        KoiPond koiPond = koiPondRepository.findById(request.getKoiPondId()).orElseThrow(() -> new RuntimeException("Pond not found"));
        logMapper.updateLog(log, request);
        log.setKoiPond(koiPond);
        return logMapper.mapToLogDto(logRepository.save(log));
    }

    @Override
    public void deleteLog(int logId) {
        logRepository.findById(logId).ifPresentOrElse(logRepository::delete, () -> {
            throw new RuntimeException("Log not found");
        });

    }

    @Override
    public LogDto getLogById(int logId) {
        return logRepository.findById(logId).map(logMapper::mapToLogDto).orElseThrow(() -> new RuntimeException("Log not found"));
    }

    @Override
    public List<LogDto> getAllLogs(String sortBy, String sortDir) {
        Sort sort = ("Desc".equalsIgnoreCase(sortDir)) ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        return logRepository.findAll(sort).stream().map(logMapper::mapToLogDto).toList();
    }

    @Override
    public List<LogDto> getLogsByPondId(long pondId) {
        return logRepository.findAllByKoiPondId(pondId).stream().map(logMapper::mapToLogDto).toList();
    }

    @Override
    public List<LogDto> getLogsByUserId(Long userId) {
        List<Log> logs = new ArrayList<>();
        koiPondRepository.findKoiPondsByUserId(userId).forEach(koiPond -> {
            logs.addAll(logRepository.findAllByKoiPondId(koiPond.getId()));
        });
        return logs.stream().map(logMapper::mapToLogDto).toList();
    }

    @Override
    public List<LogDto> getLogsByCategory(String category) {
        LogCategory logCategory = LogCategory.valueOf(category);
        return logRepository.findAllByCategory(logCategory).stream().map(logMapper::mapToLogDto).toList();
    }
}