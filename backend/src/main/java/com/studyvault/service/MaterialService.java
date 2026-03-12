package com.studyvault.service;

import com.studyvault.entity.StudyMaterial;
import com.studyvault.repository.StudyMaterialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialService {

    @Autowired
    private StudyMaterialRepository materialRepository;

    @Autowired
    private SubjectService subjectService;

    public StudyMaterial saveMaterial(StudyMaterial material) {
        return materialRepository.save(material);
    }

    public List<StudyMaterial> getMaterialsByTeacher(Long userId) {
        return materialRepository.findByUploadedById(userId);
    }

    public List<StudyMaterial> getAllMaterials() {
        return materialRepository.findAll();
    }

    public List<StudyMaterial> searchMaterials(String title, Long subjectId, StudyMaterial.MaterialType type) {
        return materialRepository.searchMaterials(title, subjectId, type);
    }

    public StudyMaterial getMaterialById(Long id) {
        return materialRepository.findById(id).orElseThrow(() -> new RuntimeException("Material not found"));
    }

    public void deleteMaterial(Long id) {
        StudyMaterial material = materialRepository.findById(id).orElse(null);
        if (material != null) {
            Long subjectId = material.getSubject() != null ? material.getSubject().getId() : null;
            materialRepository.deleteById(id);
            if (subjectId != null) {
                subjectService.deleteSubjectIfOrphan(subjectId);
            }
        }
    }
}
