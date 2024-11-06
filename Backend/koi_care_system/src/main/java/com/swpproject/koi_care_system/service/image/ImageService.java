package com.swpproject.koi_care_system.service.image;

import com.swpproject.koi_care_system.dto.ImageDto;
import com.swpproject.koi_care_system.exceptions.ResourceNotFoundException;
import com.swpproject.koi_care_system.mapper.ImageMapper;
import com.swpproject.koi_care_system.models.Image;
import com.swpproject.koi_care_system.models.Product;
import com.swpproject.koi_care_system.repository.ImageRepository;
import com.swpproject.koi_care_system.service.imageBlobStorage.AzureImageStorage;
import com.swpproject.koi_care_system.service.product.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ImageService implements IImageService {
    private final ImageRepository imageRepository;
    private final IProductService productService;
    private final AzureImageStorage imageStorage;
    private final ImageMapper imageMapper;
    @Override
    public Image getImageById(Long id) {
        return imageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No image found with id: " + id));
    }
    @Override
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHOP')")
    public void deleteImageById(Long id) {
        imageRepository.findById(id).ifPresentOrElse(image -> {
            if(!image.getDownloadUrl().isEmpty())
                imageStorage.deleteImage(image.getDownloadUrl());
            imageRepository.delete(image);
        },() -> {
            throw new ResourceNotFoundException("No image found with id: " + id);
        });
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHOP')")
    public List<ImageDto> saveImages(Long productId, List<MultipartFile> files) {
        Product product = productService.getProductById(productId);

        List<ImageDto> savedImageDto = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                String imageUrl = imageStorage.uploadImage(file);
                Image image = new Image();
                image.setFileName(file.getOriginalFilename());
                image.setFileType(file.getContentType());
                image.setDownloadUrl(imageUrl);
                image.setProduct(product);

                Image savedImage = imageRepository.save(image);

                ImageDto imageDto = new ImageDto();
                imageDto.setId(savedImage.getId());
                imageDto.setFileName(savedImage.getFileName());
                imageDto.setDownloadUrl(savedImage.getDownloadUrl());
                savedImageDto.add(imageDto);

            } catch (Exception e) {
                throw new RuntimeException("Failed to upload image: " + e.getMessage());
            }
        }
        return savedImageDto;
    }
    @Override
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHOP')")
    public void updateImage(MultipartFile file, Long imageId) {
        Image image = getImageById(imageId);
            String newImageUrl = imageStorage.uploadImage(file);
            if(!image.getDownloadUrl().isEmpty())
                imageStorage.deleteImage(image.getDownloadUrl());
            image.setFileName(file.getOriginalFilename());
            image.setFileType(file.getContentType());
            image.setDownloadUrl(newImageUrl);
            imageRepository.save(image);
    }

    @Override
    public List<ImageDto> getAll() {
        return imageRepository.findAll().stream().map(imageMapper::mapToImageDto).collect(Collectors.toList());
    }
}