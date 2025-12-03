// restAPI/ExamController.java
package com.True_Learners.Learny.restAPI;

import com.True_Learners.Learny.Business.IExamService;
import com.True_Learners.Learny.DTOs.*;
import com.True_Learners.Learny.Entities.Exam;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * EXAM CONTROLLER
 * 
 * Sınav işlemleri için REST API endpoint'leri
 * 
 * ENDPOINT'LER:
 * - GET /api/exams - Tüm sınavları getir
 * - GET /api/exams/{id} - ID'ye göre sınav getir
 * - GET /api/exams/course/{courseId} - Derse göre sınavları getir
 * - GET /api/exams/{id}/full - Sınav detayları (sorular + seçenekler)
 * - POST /api/exams/add - Basit sınav ekle
 * - POST /api/exams/create - Sorular dahil sınav oluştur
 * - POST /api/exams/submit - Sınav cevaplarını gönder ve puanla
 * - POST /api/exams/update/{id} - Sınav güncelle
 * - POST /api/exams/delete/{id} - Sınav sil
 */
@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = "http://localhost:5173")
public class ExamController {
    
    private final IExamService examService;
    
    @Autowired
    public ExamController(IExamService examService) {
        this.examService = examService;
    }
    
    // ========== TEMEL CRUD İŞLEMLERİ ==========
    
    /**
     * Tüm sınavları getir
     * 
     * ENDPOINT: GET /api/exams
     * 
     * KULLANIM: Öğretmen veya öğrenci sınav listesini görüntüler
     */
    @GetMapping
    public ResponseEntity<List<Exam>> getAll() {
        List<Exam> exams = examService.getAll();
        return ResponseEntity.ok(exams);
    }
    
    /**
     * ID'ye göre sınav getir
     * 
     * ENDPOINT: GET /api/exams/{id}
     * 
     * KULLANIM: Sınav temel bilgilerini görüntülemek için
     */
    @GetMapping("/{id}")
    public ResponseEntity<Exam> getById(@PathVariable int id) {
        Exam exam = examService.getById(id);
        if (exam == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(exam);
    }
    
    /**
     * Derse göre sınavları getir
     * 
     * ENDPOINT: GET /api/exams/course/{courseId}
     * 
     * KULLANIM: Belirli bir dersin tüm sınavlarını listele
     */
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Exam>> getByCourse(@PathVariable int courseId) {
        List<Exam> exams = examService.getByCourseId(courseId);
        return ResponseEntity.ok(exams);
    }
    
    // ========== SINAV DETAYLARI (FULL) ==========
    
    /**
     * Sınav detaylarını sorular ve seçeneklerle birlikte getir
     * 
     * ENDPOINT: GET /api/exams/{id}/full
     * 
     * KULLANIM: Öğrenci sınava başladığında bu endpoint çağrılır
     * 
     * RESPONSE:
     * {
     *   "examId": 1,
     *   "title": "Matematik Ara Sınav",
     *   "durationMinutes": 60,
     *   "questions": [
     *     {
     *       "questionId": 1,
     *       "text": "2 + 2 = ?",
     *       "type": "CoktanSecmeli",
     *       "options": [
     *         { "optionId": 1, "text": "3" },
     *         { "optionId": 2, "text": "4" },
     *         { "optionId": 3, "text": "5" }
     *       ]
     *     }
     *   ]
     * }
     */
    @GetMapping("/{id}/full")
    public ResponseEntity<?> getExamWithQuestionsAndOptions(@PathVariable int id) {
        try {
            ExamFullDTO examFullDTO = examService.getExamWithFullDetails(id);
            return ResponseEntity.ok(examFullDTO);
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    // ========== SINAV GÖNDERME VE PUANLAMA ==========
    
    /**
     * Sınav cevaplarını gönder ve puanla
     * 
     * ENDPOINT: POST /api/exams/submit
     * 
     * KULLANIM: Öğrenci sınavı bitirdiğinde cevapları gönderir
     * 
     * REQUEST BODY:
     * {
     *   "examId": 1,
     *   "studentId": 6,
     *   "answers": [
     *     { "questionId": 1, "selectedOptionIds": [2] },
     *     { "questionId": 2, "selectedOptionIds": [5] }
     *   ]
     * }
     * 
     * RESPONSE:
     * {
     *   "score": 85.50,
     *   "totalQuestions": 10,
     *   "correctAnswers": 8,
     *   "wrongAnswers": 2,
     *   "questionResults": [...]
     * }
     */
    @PostMapping("/submit")
    public ResponseEntity<?> submitExam(@RequestBody ExamSubmissionDTO examSubmission) {
        try {
            ExamResultDTO result = examService.submitExamAndCalculateScore(examSubmission);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    // ========== YENİ SINAV OLUŞTURMA ==========
    
    /**
     * Yeni sınav oluştur (sorular ve seçenekler dahil)
     * 
     * ENDPOINT: POST /api/exams/create
     * 
     * KULLANIM: Öğretmen yeni sınav ekler
     * 
     * REQUEST BODY:
     * {
     *   "title": "Matematik Ara Sınav",
     *   "description": "Birinci dönem ara sınav",
     *   "durationMinutes": 60,
     *   "courseId": 1,
     *   "questions": [
     *     {
     *       "text": "2 + 2 = ?",
     *       "type": "CoktanSecmeli",
     *       "options": [
     *         { "text": "3", "isCorrect": false },
     *         { "text": "4", "isCorrect": true },
     *         { "text": "5", "isCorrect": false }
     *       ]
     *     }
     *   ]
     * }
     * 
     * RESPONSE:
     * {
     *   "examId": 15,
     *   "message": "Sınav başarıyla oluşturuldu"
     * }
     */
    @PostMapping("/create")
    public ResponseEntity<?> createExam(@Valid @RequestBody ExamCreateDTO examCreateDTO) {
        try {
            int examId = examService.createExamWithQuestions(examCreateDTO);
            return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new CreateExamResponse(examId, "Sınav başarıyla oluşturuldu"));
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    // ========== ESKİ CRUD İŞLEMLERİ ==========
    
    @PostMapping("/add")
    public ResponseEntity<?> add(@RequestBody Exam exam) {
        try {
            examService.add(exam);
            return ResponseEntity.ok(new SuccessResponse("Sınav eklendi"));
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable int id, @RequestBody Exam exam) {
        try {
            exam.setId(id);
            examService.update(exam);
            return ResponseEntity.ok(new SuccessResponse("Sınav güncellendi"));
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    @PostMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        try {
            Exam e = examService.getById(id);
            if (e == null) {
                return ResponseEntity.notFound().build();
            }
            examService.delete(e);
            return ResponseEntity.ok(new SuccessResponse("Sınav silindi"));
        } catch (Exception ex) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(ex.getMessage()));
        }
    }
    
    // ========== RESPONSE CLASSES ==========
    
    private static class ErrorResponse {
        private String error;
        
        public ErrorResponse(String error) {
            this.error = error;
        }
        
        public String getError() {
            return error;
        }
        
        public void setError(String error) {
            this.error = error;
        }
    }
    
    private static class SuccessResponse {
        private String message;
        
        public SuccessResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }
    
    private static class CreateExamResponse {
        private int examId;
        private String message;
        
        public CreateExamResponse(int examId, String message) {
            this.examId = examId;
            this.message = message;
        }
        
        public int getExamId() {
            return examId;
        }
        
        public void setExamId(int examId) {
            this.examId = examId;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }
}