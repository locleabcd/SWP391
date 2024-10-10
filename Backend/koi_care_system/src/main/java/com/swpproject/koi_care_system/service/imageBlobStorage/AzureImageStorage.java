package com.swpproject.koi_care_system.service.imageBlobStorage;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.models.BlobStorageException;
import com.swpproject.koi_care_system.exceptions.CustomBlobStorageException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
@Service
public class AzureImageStorage implements ImageStorage {
    private final BlobServiceClient blobServiceClient;
    public AzureImageStorage(BlobServiceClient blobServiceClient){
        this.blobServiceClient = blobServiceClient;
    }
    @Override
    public String uploadImage(MultipartFile file)  {
        try(InputStream inputStream = file.getInputStream()){
            String containerName="koicarestorage";
            BlobContainerClient blobContainerClient= blobServiceClient.getBlobContainerClient(containerName);
            String newImageName = UUID.randomUUID()+ Objects.requireNonNull(file.getOriginalFilename()).substring(file.getOriginalFilename().lastIndexOf("."));
            BlobClient blobClient = blobContainerClient.getBlobClient(newImageName);
            blobClient.upload(inputStream,file.getSize(),true);
            return blobClient.getBlobUrl();
        }catch (BlobStorageException | IOException e) {
            throw new CustomBlobStorageException("Failed to upload image to Azure Blob Storage", e);
        }
    }
    @Override
    public List<String> uploadListImage(List<MultipartFile> listFile){
        List<String> resource = new ArrayList<>();
        for(MultipartFile file:listFile ){
            resource.add(this.uploadImage(file));
        }
        return resource;
    }

    @Override
    public void deleteImage(String imageUrl) {
        try {
            String containerName = "koicarestorage";
            BlobContainerClient blobContainerClient = blobServiceClient.getBlobContainerClient(containerName);
            String blobName = extractBlobNameFromUrl(imageUrl);
            BlobClient blobClient = blobContainerClient.getBlobClient(blobName);
            blobClient.delete();
        } catch (BlobStorageException e) {
            throw new CustomBlobStorageException("Failed to delete image from Azure Blob Storage", e);
        }
    }

    private String extractBlobNameFromUrl(String imageUrl) {
        // Extract the blob name from the URL
        // This might need to be adjusted based on your exact URL format
        return imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
    }
}