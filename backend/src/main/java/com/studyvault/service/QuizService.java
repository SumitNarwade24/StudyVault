package com.studyvault.service;

import com.studyvault.entity.Quiz;
import com.studyvault.repository.QuizRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private SubjectService subjectService;

    public Quiz saveQuiz(Quiz quiz) {
        // Ensure bidirectional relationship is maintained for mapping
        if (quiz.getQuestions() != null) {
            quiz.getQuestions().forEach(q -> {
                q.setQuiz(quiz);
                if (q.getOptions() != null) {
                    q.getOptions().forEach(o -> o.setQuestion(q));
                }
            });
        }
        return quizRepository.save(quiz);
    }

    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    public List<Quiz> getQuizzesBySubject(Long subjectId) {
        return quizRepository.findBySubjectId(subjectId);
    }

    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id).orElseThrow(() -> new RuntimeException("Quiz not found"));
    }

    public Quiz saveQuizFromPayload(java.util.Map<String, Object> payload, com.studyvault.entity.Subject subject) {
        Quiz quiz = new Quiz();
        quiz.setTitle((String) payload.get("title"));
        quiz.setSubject(subject);

        List<java.util.Map<String, Object>> questionsData = (List<java.util.Map<String, Object>>) payload
                .get("questions");
        if (questionsData != null) {
            List<com.studyvault.entity.Question> questions = questionsData.stream().map(qData -> {
                com.studyvault.entity.Question question = new com.studyvault.entity.Question();
                question.setQuestionText((String) qData.get("questionText"));
                question.setQuiz(quiz);

                List<java.util.Map<String, Object>> optionsData = (List<java.util.Map<String, Object>>) qData
                        .get("options");
                if (optionsData != null) {
                    List<com.studyvault.entity.Option> options = optionsData.stream().map(oData -> {
                        com.studyvault.entity.Option option = new com.studyvault.entity.Option();
                        option.setOptionText((String) oData.get("optionText"));
                        option.setCorrect((Boolean) oData.get("isCorrect"));
                        option.setQuestion(question);
                        return option;
                    }).toList();
                    question.setOptions(options);
                }
                return question;
            }).toList();
            quiz.setQuestions(questions);
        }
        return quizRepository.save(quiz);
    }

    public void deleteQuiz(Long id) {
        Quiz quiz = quizRepository.findById(id).orElse(null);
        if (quiz != null) {
            Long subjectId = quiz.getSubject() != null ? quiz.getSubject().getId() : null;
            quizRepository.deleteById(id);
            if (subjectId != null) {
                subjectService.deleteSubjectIfOrphan(subjectId);
            }
        }
    }
}
