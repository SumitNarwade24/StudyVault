package com.studyvault.controller;

import com.studyvault.entity.Quiz;
import com.studyvault.service.QuizService;
import com.studyvault.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @Autowired
    private SubjectService subjectService;

    @PostMapping
    public ResponseEntity<?> createQuiz(@RequestBody java.util.Map<String, Object> payload) {
        try {
            Quiz quiz = new Quiz();
            quiz.setTitle((String) payload.get("title"));

            String subjectName = (String) payload.get("subjectName");
            quiz.setSubject(subjectService.getOrCreateSubject(subjectName));

            Quiz savedQuiz = quizService.saveQuizFromPayload(payload, quiz.getSubject());

            return ResponseEntity.ok(savedQuiz);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllQuizzes(@RequestParam(required = false) Long subjectId) {
        if (subjectId != null) {
            return ResponseEntity.ok(quizService.getQuizzesBySubject(subjectId));
        }
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getQuizById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(quizService.getQuizById(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
            // OR:
            // return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.ok().build();
    }
}