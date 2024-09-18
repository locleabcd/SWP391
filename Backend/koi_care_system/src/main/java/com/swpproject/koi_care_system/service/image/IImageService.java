package com.swpproject.koi_care_system.service.image;

import com.swpproject.koi_care_system.dto.ImageDto;
import com.swpproject.koi_care_system.models.Image;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IImageService {
    Image getImageById(Long id);
    void deleteImageById(Long id);
    List<ImageDto> saveProductImages(Long productId, List<MultipartFile> files);
    ImageDto saveKoiPondImages(Long koiPondID, MultipartFile file);
//    ImageDto saveKoiFishImages(Long koiFishID,MultipartFile file);

    void updateImage(MultipartFile file,  Long imageId);
}
