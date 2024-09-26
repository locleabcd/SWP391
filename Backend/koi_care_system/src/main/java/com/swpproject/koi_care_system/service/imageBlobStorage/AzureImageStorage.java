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
    public String uploadImage(MultipartFile file)  throws IOException {
        try(InputStream inputStream = file.getInputStream()){
            String containerName="koicare-blob";
            BlobContainerClient blobContainerClient= blobServiceClient.getBlobContainerClient(containerName);
            String newImageName = UUID.randomUUID()+ Objects.requireNonNull(file.getOriginalFilename()).substring(file.getOriginalFilename().lastIndexOf("."));
            BlobClient blobClient = blobContainerClient.getBlobClient(newImageName);
            blobClient.upload(inputStream,file.getSize(),true);
            return blobClient.getBlobUrl();
        }catch (BlobStorageException e) {
            throw new CustomBlobStorageException("Failed to upload image to Azure Blob Storage", e);
        }

    }
    @Override
    public List<String> uploadListImage(List<MultipartFile> listFile) throws IOException {
        List<String> resource = new ArrayList<>();
        for(MultipartFile file:listFile ){
            resource.add(this.uploadImage(file));
        }
        return resource;
    }
}