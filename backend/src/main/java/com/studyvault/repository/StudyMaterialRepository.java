package com.studyvault.repository;

import com.studyvault.entity.StudyMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface StudyMaterialRepository extends JpaRepository<StudyMaterial, Long> {
        List<StudyMaterial> findByUploadedById(Long userId);

        List<StudyMaterial> findBySubjectId(Long subjectId);

        @Query("SELECT s FROM StudyMaterial s WHERE (:title IS NULL OR LOWER(s.title) LIKE LOWER(CONCAT('%', :title, '%'))) "
                        +
                        "AND (:subjectId IS NULL OR s.subject.id = :subjectId) " +
                        "AND (:type IS NULL OR s.type = :type)")
        List<StudyMaterial> searchMaterials(@Param("title") String title,
                        @Param("subjectId") Long subjectId,
                        @Param("type") StudyMaterial.MaterialType type);
}
