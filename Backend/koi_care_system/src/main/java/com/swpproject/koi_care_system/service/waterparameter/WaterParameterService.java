package com.swpproject.koi_care_system.service.waterparameter;

import com.swpproject.koi_care_system.dto.WaterParameterDto;
import com.swpproject.koi_care_system.mapper.WaterParameterMapper;
import com.swpproject.koi_care_system.models.KoiPond;
import com.swpproject.koi_care_system.models.WaterParameters;
import com.swpproject.koi_care_system.payload.request.ParametersCreateRequest;
import com.swpproject.koi_care_system.payload.request.ParametersUpdateRequest;
import com.swpproject.koi_care_system.repository.KoiPondRepository;
import com.swpproject.koi_care_system.repository.WaterParametersRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class WaterParameterService implements IWaterParameters {
    WaterParametersRepository waterParametersRepository;
    WaterParameterMapper waterParameterMapper;
    KoiPondRepository koiPondRepository;

    @Override
    public WaterParameterDto createWaterParameters(ParametersCreateRequest parametersCreateRequest) {
        KoiPond koiPond = koiPondRepository.findById(parametersCreateRequest.getKoiPondId()).orElseThrow(() -> new RuntimeException("KoiPond not found"));
        WaterParameters waterParameters = waterParameterMapper.mapToWaterParameters(parametersCreateRequest);
        waterParameters.setKoiPond(koiPond);
        return waterParameterMapper.mapToWaterParameterDto(waterParametersRepository.save(waterParameters));
    }

    @Override
    public WaterParameterDto updateWaterParameters(long id, ParametersUpdateRequest request) {
        WaterParameters waterParameters = waterParametersRepository.findById(id).orElseThrow(() -> new RuntimeException("WaterParameters not found"));
        KoiPond koiPond = koiPondRepository.findById(request.getKoiPondId()).orElseThrow(() -> new RuntimeException("KoiPond not found"));
        waterParameterMapper.updateWaterParameters(waterParameters, request);
        waterParameters.setKoiPond(koiPond);
        return waterParameterMapper.mapToWaterParameterDto(waterParametersRepository.save(waterParameters));
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
}