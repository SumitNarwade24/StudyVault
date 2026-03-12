package com.studyvault.controller;

import com.studyvault.entity.StudyMaterial;
import com.studyvault.service.AuthService;
import com.studyvault.service.FileStorageService;
import com.studyvault.service.MaterialService;
import com.studyvault.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.servlet.http.HttpServletRequest;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/materials")
public class MaterialController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Autowired
    private AuthService authService;

    @Autowired
    private MaterialService materialService;

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadMaterial(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("type") String type,
            @RequestParam("subjectName") String subjectName,
            @RequestParam("userId") Long userId) {
        try {
            StudyMaterial material = new StudyMaterial();
            material.setTitle(title);
            material.setDescription(description);
            StudyMaterial.MaterialType materialType = StudyMaterial.MaterialType.valueOf(type.toUpperCase());
            material.setType(materialType);

            // Get or create subject by name
            material.setSubject(subjectService.getOrCreateSubject(subjectName));

            // Set user
            material.setUploadedBy(authService.getUserById(userId));

            if (materialType == StudyMaterial.MaterialType.VIDEO) {
                // If it's a video, the frontend sends the URL in the 'file' part as text (demo
                // hack)
                // or we can just expect it as a parameter if we changed the frontend.
                // Let's stick to the current frontend logic where it might be in 'file'
                if (file != null && !file.isEmpty()) {
                    String url = new String(file.getBytes());
                    material.setFilePath(url);
                }
            } else if (file != null) {
                String subDir = type.toLowerCase();
                String filePath = fileStorageService.storeFile(file, subDir);
                material.setFilePath(filePath);
            }

            return ResponseEntity.ok(materialService.saveMaterial(material));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getMaterials(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Long subjectId,
            @RequestParam(required = false) String type) {
        StudyMaterial.MaterialType materialType = type != null ? StudyMaterial.MaterialType.valueOf(type.toUpperCase())
                : null;
        return ResponseEntity.ok(materialService.searchMaterials(title, subjectId, materialType));
    }

    @GetMapping("/my")
    public ResponseEntity<?> getTeacherMaterials(@RequestParam Long userId) {
        return ResponseEntity.ok(materialService.getMaterialsByTeacher(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMaterial(@PathVariable Long id) {
        materialService.deleteMaterial(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/view/**")
    public ResponseEntity<Resource> viewFile(HttpServletRequest request) {
        try {
            String path = request.getRequestURI().split("/view/")[1];
            Path filePath = Paths.get(uploadDir).resolve(path).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                String contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
                if (contentType == null) {
                    contentType = "application/octet-stream";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
