package com.helloword.kidservice.global.utils;

import com.helloword.kidservice.global.exception.MainException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.UUID;

import static com.helloword.kidservice.global.exception.CustomException.*;

@Slf4j
@RequiredArgsConstructor
@Service
public class FileService {

    @Value("${aws.s3.bucket}")
    private String bucket;

    @Value("${aws.s3.base-url}")
    private String baseUrl;

    private static final int IMAGE_SIZE = 50;

    private final S3Client s3Client;

    public String uploadImage(MultipartFile file) {
        validateFile(file, IMAGE_SIZE, new String[]{"jpg", "jpeg", "png"});

        try {
            BufferedImage image = ImageIO.read(file.getInputStream());
            BufferedImage newImage = new BufferedImage(image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_RGB);
            Graphics2D g = newImage.createGraphics();
            g.drawImage(image, 0, 0, Color.WHITE, null);
            g.dispose();
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            ImageIO.write(newImage, "jpg", os);
            byte[] jpgBytes = os.toByteArray();
            return uploadToS3(new ByteArrayInputStream(jpgBytes), UUID.randomUUID().toString() + ".jpg", "image/jpeg");
        } catch (IOException e) {
            throw new MainException(FILE_UPLOAD_FAILED);
        }
    }

    public String uploadToS3(InputStream inputStream, String fileName, String contentType) {
        try {
            byte[] bytes = inputStream.readAllBytes();

            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(fileName)
                    .contentType(contentType)
                    .build();

            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(bytes));
        } catch (IOException e) {
            throw new MainException(FILE_UPLOAD_FAILED);
        }
        log.info("url = {}", fileName);
        return baseUrl + "/" + fileName;
    }

    private void validateFile(MultipartFile file, int sizeThreshold, String[] exts) throws MainException {

        if (file.getSize() <= sizeThreshold) {
            throw new MainException(FILE_SIZE_EXCEEDED);
        }

        String originalFilename = file.getOriginalFilename();
        String ext = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);
        if (!isExtensionAllowed(ext, exts)) {
            throw new MainException(INVALID_FILE_EXTENSION);
        }
    }

    private boolean isExtensionAllowed(String extension, String[] allowedExtensions) {
        for (String allowedExtension : allowedExtensions) {
            if (extension.equalsIgnoreCase(allowedExtension)) {
                return true;
            }
        }
        return false;
    }
}
