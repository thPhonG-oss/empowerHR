package com.hr_management.hr_management.controller;

import com.hr_management.hr_management.service.Impl.CloudinaryService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequestMapping("/api/v1/upload")
public class UploadController {
    CloudinaryService cloudinaryService;

    @PostMapping("/{folderName}")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file,@PathVariable String folderName)throws IOException {
        String url = cloudinaryService.uploadFile(file, folderName);
        return ResponseEntity.ok(Map.of("url", url));
    }
}
