package com.swpproject.koi_care_system.service.image;

import java.io.IOException;
import java.io.InputStream;

public interface ImageStorage {
    String uploadImage(String originalImageName, InputStream data,Long length ) throws IOException;
}