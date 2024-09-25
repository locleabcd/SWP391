package com.swpproject.koi_care_system.service.image;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.models.BlobStorageException;
import com.swpproject.koi_care_system.exceptions.CustomBlobStorageException;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;
@Service
public class AzureImageStorage implements ImageStorage {
    private final BlobServiceClient blobServiceClient;

    public AzureImageStorage(BlobServiceClient blobServiceClient){
        this.blobServiceClient = blobServiceClient;
    }
    @Override
    public String uploadImage(String originalImageName, InputStream data, Long length)  throws IOException {
        try{
            String containerName = "koicare-blob";
            BlobContainerClient blobContainerClient= blobServiceClient.getBlobContainerClient(containerName);
            String newImageName = UUID.randomUUID().toString() +originalImageName.substring(originalImageName.lastIndexOf("."));
            BlobClient blobClient = blobContainerClient.getBlobClient(newImageName);
            blobClient.upload(data,length,true);
            return blobClient.getBlobUrl();
        }catch (BlobStorageException e) {
            throw new CustomBlobStorageException("Failed to upload image to Azure Blob Storage", e);
        }

    }
}
