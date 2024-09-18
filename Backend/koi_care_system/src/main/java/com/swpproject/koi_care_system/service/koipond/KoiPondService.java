package com.swpproject.koi_care_system.service.koipond;

import com.swpproject.koi_care_system.dto.ImageDto;
import com.swpproject.koi_care_system.dto.KoiPondDto;
import com.swpproject.koi_care_system.exceptions.AlreadyExistsException;
import com.swpproject.koi_care_system.exceptions.ResourceNotFoundException;
import com.swpproject.koi_care_system.mapper.ImageMapper;
import com.swpproject.koi_care_system.mapper.KoiPondMapper;
import com.swpproject.koi_care_system.models.Image;
import com.swpproject.koi_care_system.payload.request.AddKoiPondRequest;
import com.swpproject.koi_care_system.payload.request.KoiPondUpdateRequest;
import com.swpproject.koi_care_system.models.KoiPond;
import com.swpproject.koi_care_system.repository.ImageRepository;
import com.swpproject.koi_care_system.repository.KoiPondRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class KoiPondService implements IKoiPondService {
    KoiPondRepository koiPondRepository;
    ImageRepository imageRepository;
    KoiPondMapper koiPondMapper;
    ImageMapper imageMapper;
    @Override
    public KoiPond addKoiPond(AddKoiPondRequest request) {
        if (koiPondRepository.existsByName(request.getName())) {
            throw new AlreadyExistsException("A Koi Pond with this name already exists");
        }
        Image image = request.getImage();
        Image savedImage = imageRepository.save(image);
        KoiPond koiPond = new KoiPond(
            null,
            request.getName(),
            request.getDrainCount(),
            request.getDepth(),
            request.getSkimmer(),
            request.getPumpCapacity(),
            request.getUser(),
            savedImage
        );
        return koiPondRepository.save(koiPond);
    }
    @Override
    public KoiPond getKoiPondById(Long id) {
        return koiPondRepository.findKoiPondsById(id);
    }
    @Override
    public List<KoiPond> getKoiPondByUserID(Long userID) {
        return koiPondRepository.findByUserId(userID)
                .orElseThrow(() -> new ResourceNotFoundException("No Koi Ponds found for user with ID: " + userID));
    }
    @Override
    public void deleteKoiPond(Long id) {
        koiPondRepository.findById(id)
                .ifPresentOrElse(koiPondRepository::delete,()->{
                    throw new ResourceNotFoundException("Koi Pond not found!");
                });
    }
    @Override
    public KoiPond updateKoiPond(KoiPondUpdateRequest koiPondUpdateRequest, Long koiPondId) {
        return Optional.ofNullable(getKoiPondById(koiPondId)).map(oldKoiPond ->{
            oldKoiPond.setName(koiPondUpdateRequest.getName());
            return koiPondRepository.save(oldKoiPond);
        }).orElseThrow(()->new ResourceNotFoundException("Koi pond nott found!"));
    }
    @Override
    public int numOfKoiFishInPond(KoiPond koiPond) {
        return koiPond.getKoiFishList().size();
    }

    @Override
    public List<KoiPondDto> getConvertedKoiPonds(List<KoiPond> koiPonds) {
        return koiPonds.stream().map(this::convertToDto).toList();
    }

    @Override
    public KoiPondDto convertToDto(KoiPond koiPond) {
        KoiPondDto koiPondDto = koiPondMapper.toDto(koiPond);
        Image image = imageRepository.findByKoiPondId(koiPond.getId());
        ImageDto imageDto = imageMapper.toDto(image);
        koiPondDto.setImage(imageDto);
        return koiPondDto;
    }

}
