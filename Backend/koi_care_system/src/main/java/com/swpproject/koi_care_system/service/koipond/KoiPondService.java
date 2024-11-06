package com.swpproject.koi_care_system.service.koipond;

import com.swpproject.koi_care_system.dto.KoiPondDto;
import com.swpproject.koi_care_system.exceptions.AlreadyExistsException;
import com.swpproject.koi_care_system.exceptions.ResourceNotFoundException;
import com.swpproject.koi_care_system.mapper.KoiPondMapper;
import com.swpproject.koi_care_system.models.KoiPond;
import com.swpproject.koi_care_system.payload.request.AddKoiPondRequest;
import com.swpproject.koi_care_system.payload.request.KoiPondUpdateRequest;
import com.swpproject.koi_care_system.repository.KoiPondRepository;
import com.swpproject.koi_care_system.service.imageBlobStorage.ImageStorage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class KoiPondService implements IKoiPondService {
    KoiPondRepository koiPondRepository;
    KoiPondMapper koiPondMapper;
    ImageStorage imageStorage;
    @Override
    @PreAuthorize("hasRole('MEMBER')")
    public KoiPondDto addKoiPond(AddKoiPondRequest addKoiPondRequest) throws IOException {
        if (koiPondRepository.existsByNameAndUserId(addKoiPondRequest.getName(), addKoiPondRequest.getUser().getId())) {
            throw new AlreadyExistsException("Koi Pond with name " + addKoiPondRequest.getName() + " already exists!");
        }
        KoiPond koiPond = koiPondMapper.mapToKoiPond(addKoiPondRequest);
        if(addKoiPondRequest.getFile()!=null)
            koiPond.setImageUrl(!addKoiPondRequest.getFile().isEmpty() ? imageStorage.uploadImage(addKoiPondRequest.getFile()) : "https://koicaresystemv3.blob.core.windows.net/koicarestorage/defaultKoiPond.jpg");
        else
            koiPond.setImageUrl("https://koicaresystemv3.blob.core.windows.net/koicarestorage/defaultKoiPond.jpg");
        return koiPondMapper.toDto(koiPondRepository.save(koiPond));
    }
    @Override
    @PreAuthorize("hasRole('MEMBER')")
    public KoiPondDto getKoiPondById(Long id) {
        return koiPondMapper.toDto(koiPondRepository.findKoiPondsById(id));
    }
    @Override
    @PreAuthorize("hasRole('MEMBER')")
    public List<KoiPondDto> getKoiPondByUserID(Long userID) {
        return  koiPondRepository.findByUserId(userID).stream().map(koiPondMapper::toDto).toList();
    }
    @Override
    @PreAuthorize("hasRole('MEMBER')")
    public void deleteKoiPond(Long id) {
        koiPondRepository.findById(id)
                .ifPresentOrElse(koiPond -> {
                    if (!koiPond.getImageUrl().equals("https://koicaresystemv3.blob.core.windows.net/koicarestorage/defaultKoiPond.jpg")) {
                        try {
                            imageStorage.deleteImage(koiPond.getImageUrl());
                        }catch (Exception e){
                            throw new RuntimeException(e);
                        }
                    }
                    koiPondRepository.delete(koiPond);
                },()-> {
                    throw new ResourceNotFoundException("Koi Pond not found!");
                });
    }
    @Override
    @PreAuthorize("hasRole('MEMBER')")
    public KoiPondDto updateKoiPond(KoiPondUpdateRequest koiPondUpdateRequest, Long koiPondId) {

        KoiPond oldKoiPond = koiPondRepository.findKoiPondsById(koiPondId);
        if(koiPondUpdateRequest.getFile()!=null) {
            if(!koiPondUpdateRequest.getFile().isEmpty())
                try {
                    if (!oldKoiPond.getImageUrl().equals("https://koicaresystemv3.blob.core.windows.net/koicarestorage/defaultKoiPond.jpg"))
                        imageStorage.deleteImage(oldKoiPond.getImageUrl());
                    oldKoiPond.setImageUrl(imageStorage.uploadImage(koiPondUpdateRequest.getFile()));
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
        }
        koiPondMapper.updateToKoiPond(oldKoiPond,koiPondUpdateRequest);
        return koiPondMapper.toDto(koiPondRepository.save(oldKoiPond));
    }

    @Override
    public List<KoiPondDto> getKoiPondByUserIdWithCurrentDate(Long userId, LocalDate date){
        return  koiPondRepository.findKoiPondsByUserId(userId)
                .stream().map(koiPondMapper::toDto)
                .filter(koiPondDto -> koiPondDto.getCreateDate().equals(date))
                .toList();
    }
}