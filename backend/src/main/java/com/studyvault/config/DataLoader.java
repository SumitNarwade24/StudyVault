package com.studyvault.config;

import com.studyvault.entity.*;
import com.studyvault.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(
            SubjectRepository subjectRepository,
            StudyMaterialRepository studyMaterialRepository,
            QuizRepository quizRepository) {
        return args -> {
            if (subjectRepository.count() == 0) {
                Subject math = new Subject(null, "Mathematics", "Core mathematics subjects");
                Subject science = new Subject(null, "Science", "Physics, Chemistry, and Biology");
                Subject programming = new Subject(null, "Programming", "Java, Python, JS, etc.");

                subjectRepository.saveAll(Arrays.asList(math, science, programming));

                // Sample Materials
                studyMaterialRepository.save(new StudyMaterial(null, "Algebra 101", "Basic algebra notes",
                        "algebra.pdf", StudyMaterial.MaterialType.PDF, math, null));
                studyMaterialRepository.save(new StudyMaterial(null, "Calculus for Beginners",
                        "Intro to limits and derivatives", "https://www.youtube.com/watch?v=W3QJ7z9Uaxw",
                        StudyMaterial.MaterialType.VIDEO, math, null));
                studyMaterialRepository.save(new StudyMaterial(null, "Introduction to Java",
                        "Everything you need to know about Java", "https://www.youtube.com/watch?v=eIrMbBbPneA",
                        StudyMaterial.MaterialType.VIDEO, programming, null));
                studyMaterialRepository.save(new StudyMaterial(null, "Data Structures PDF", "Comprehensive guide to DS",
                        "ds.pdf", StudyMaterial.MaterialType.PDF, programming, null));

                // Sample Quiz
                Quiz javaQuiz = new Quiz(null, "Java Basics Quiz", programming, null);
                javaQuiz = quizRepository.save(javaQuiz);

                Question q1 = new Question(null, "What is JVM?", javaQuiz, null);
                Option o1_1 = new Option(null, "Java Virtual Machine", true, q1);
                Option o1_2 = new Option(null, "Java Visual Model", false, q1);
                q1.setOptions(Arrays.asList(o1_1, o1_2));

                Question q2 = new Question(null, "Which keyword is used to inherit a class?", javaQuiz, null);
                Option o2_1 = new Option(null, "implements", false, q2);
                Option o2_2 = new Option(null, "extends", true, q2);
                q2.setOptions(Arrays.asList(o2_1, o2_2));

                javaQuiz.setQuestions(Arrays.asList(q1, q2));
                quizRepository.save(javaQuiz);

                System.out.println("Comprehensive sample data seeded!");
            }
        };
    }
}
