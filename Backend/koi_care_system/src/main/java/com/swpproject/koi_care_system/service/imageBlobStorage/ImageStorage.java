package com.swpproject.koi_care_system.service.imageBlobStorage;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ImageStorage {
    String uploadImage(MultipartFile file);
    List<String> uploadListImage(List<MultipartFile> file);

    void deleteImage(String imageUrl);
}