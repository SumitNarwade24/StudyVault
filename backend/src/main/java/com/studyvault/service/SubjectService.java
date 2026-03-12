package com.studyvault.service;

import com.studyvault.entity.Subject;
import com.studyvault.repository.SubjectRepository;
import com.studyvault.repository.StudyMaterialRepository;
import com.studyvault.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private StudyMaterialRepository materialRepository;

    @Autowired
    private QuizRepository quizRepository;

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public Subject getOrCreateSubject(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Subject name cannot be empty");
        }
        String normalizedName = name.trim();
        return subjectRepository.findByName(normalizedName)
                .orElseGet(() -> {
                    Subject newSubject = new Subject();
                    newSubject.setName(normalizedName);
                    return subjectRepository.save(newSubject);
                });
    }

    public void deleteSubjectIfOrphan(Long subjectId) {
        if (subjectId == null)
            return;

        boolean hasMaterials = !materialRepository.findBySubjectId(subjectId).isEmpty();
        boolean hasQuizzes = !quizRepository.findBySubjectId(subjectId).isEmpty();

        if (!hasMaterials && !hasQuizzes) {
            subjectRepository.deleteById(subjectId);
        }
    }
}
