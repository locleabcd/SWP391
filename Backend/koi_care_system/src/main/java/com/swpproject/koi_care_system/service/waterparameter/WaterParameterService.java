package com.swpproject.koi_care_system.service.waterparameter;

import com.swpproject.koi_care_system.dto.KoiPondDto;
import com.swpproject.koi_care_system.dto.WaterParameterDto;
import com.swpproject.koi_care_system.mapper.WaterParameterMapper;
import com.swpproject.koi_care_system.models.KoiPond;
import com.swpproject.koi_care_system.models.WaterParameters;
import com.swpproject.koi_care_system.payload.request.ParametersCreateRequest;
import com.swpproject.koi_care_system.payload.request.ParametersUpdateRequest;
import com.swpproject.koi_care_system.repository.KoiPondRepository;
import com.swpproject.koi_care_system.repository.WaterParametersRepository;
import com.swpproject.koi_care_system.service.issue.IssueService;
import com.swpproject.koi_care_system.service.issue.IssueTypeService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WaterParameterService implements IWaterParameters {
    WaterParametersRepository waterParametersRepository;
    WaterParameterMapper waterParameterMapper;
    KoiPondRepository koiPondRepository;
    IssueService issueService;
    IssueTypeService issueTypeService;

    @Override
    public WaterParameterDto createWaterParameters(ParametersCreateRequest parametersCreateRequest) {
        KoiPond koiPond = koiPondRepository.findById(parametersCreateRequest.getKoiPondId()).orElseThrow(() -> new RuntimeException("KoiPond not found"));
        WaterParameters waterParameters = waterParameterMapper.mapToWaterParameters(parametersCreateRequest);
        waterParameters.setKoiPond(koiPond);
        waterParametersRepository.save(waterParameters);
        issueTypeService.init();//RUN THROUGH AND CREATE ISSUE TYPES
        issueService.detectIssues(waterParameters);//check issue
        return waterParameterMapper.mapToWaterParameterDto(waterParameters);
    }

    @Override
    public WaterParameterDto updateWaterParameters(long id, ParametersUpdateRequest request) {
        WaterParameters waterParameters = waterParametersRepository.findById(id).orElseThrow(() -> new RuntimeException("WaterParameters not found"));
        KoiPond koiPond = koiPondRepository.findById(request.getKoiPondId()).orElseThrow(() -> new RuntimeException("KoiPond not found"));
        waterParameterMapper.updateWaterParameters(waterParameters, request);
        waterParameters.setKoiPond(koiPond);
        waterParametersRepository.save(waterParameters);
        issueService.detectIssues(waterParameters);//check issue
        return waterParameterMapper.mapToWaterParameterDto(waterParameters);
    }

    @Override
    public void deleteWaterParameters(long id) {
        WaterParameters waterParameters = waterParametersRepository.findById(id).orElseThrow(() -> new RuntimeException("WaterParameters not found"));
        waterParametersRepository.delete(waterParameters);
    }

    @Override
    public List<WaterParameterDto> getAllWaterParameters(int pageNumber, int pageSize, String sortBy, String sortDir) {
        Sort sort = ("Asc".equalsIgnoreCase(sortDir)) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<WaterParameters> waterParameters = waterParametersRepository.findAll(pageable);
        return waterParameters.map(waterParameterMapper::mapToWaterParameterDto).getContent();
    }

    @Override
    public WaterParameterDto getWaterParametersById(long id) {
        return waterParametersRepository.findById(id)
                .map(waterParameterMapper::mapToWaterParameterDto)
                .orElseThrow(() -> new RuntimeException("WaterParameters not found"));
    }

    @Override
    public List<WaterParameterDto> getAllWaterParametersByKoiPondId(Long koiPondId) {
        List<WaterParameters> waterParameters = waterParametersRepository.findByKoiPondId(koiPondId);
        return waterParameters.stream()
                .map(waterParameterMapper::mapToWaterParameterDto)
                .collect(Collectors.toList());
    }
    @Override
    public List<WaterParameterDto> getAllWaterParametersByUserId(Long userId){
        List<WaterParameters> waterParameters = new ArrayList<>();
        koiPondRepository.findKoiPondsByUserId(userId).forEach(koiPond -> {
            waterParameters.addAll(waterParametersRepository.findByKoiPondId(koiPond.getId()));
        });
        return waterParameters.stream().map(waterParameterMapper::mapToWaterParameterDto).toList();
    }

    @Override
    public WaterParameterDto getLatestWaterParametersByKoiPondId(Long koiPondId) {
        WaterParameters lastestWaterParameters = waterParametersRepository.findTopByKoiPondId(koiPondId);
        return waterParameterMapper.mapToWaterParameterDto(lastestWaterParameters);
    }

}