// src/main/java/com/True_Learners/Learny/restAPI/ExamController.java
package com.True_Learners.Learny.restAPI;

import com.True_Learners.Learny.Business.IExamService;
import com.True_Learners.Learny.DTOs.ExamCreateDTO;
import com.True_Learners.Learny.DTOs.ExamFullDTO;
import com.True_Learners.Learny.DTOs.ExamResultDTO;
import com.True_Learners.Learny.DTOs.ExamSubmissionDTO;
import com.True_Learners.Learny.Entities.Exam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ✅ EKSIKSIZ EXAM CONTROLLER
 * 
 * GET ve POST metodları dahil
 */
@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = "*")
public class ExamController {

    @Autowired
    private IExamService examService;

    // ========== GET METODLARI (EKSİK OLAN KISIM) ==========
    
    /**
     * ✅ TÜM SINAVLARI GETİR - GET /api/exams
     * Frontend'in çağırdığı metod bu!
     */
    @GetMapping
    public ResponseEntity<?> getAllExams() {
        try {
            List<Exam> exams = examService.getAll();
            return ResponseEntity.ok(exams);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Sınavlar getirilemedi: " + e.getMessage());
        }
    }
    
    /**
     * ✅ ID'YE GÖRE SINAV GETİR - GET /api/exams/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getExamById(@PathVariable int id) {
        try {
            Exam exam = examService.getById(id);
            if (exam == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Sınav bulunamadı: " + id);
            }
            return ResponseEntity.ok(exam);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Sınav getirilemedi: " + e.getMessage());
        }
    }
    
    /**
     * ✅ DERSE GÖRE SINAVLARI GETİR - GET /api/exams/course/{courseId}
     */
    @GetMapping("/course/{courseId}")
    public ResponseEntity<?> getExamsByCourse(@PathVariable int courseId) {
        try {
            List<Exam> exams = examService.getByCourseId(courseId);
            return ResponseEntity.ok(exams);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Sınavlar getirilemedi: " + e.getMessage());
        }
    }
    
    /**
     * ✅ SINAV DETAYLARI (SORULAR + SEÇENEKLER) - GET /api/exams/{id}/full
     * Öğrenci sınava başladığında bu metod çağrılır
     */
    @GetMapping("/{id}/full")
    public ResponseEntity<?> getExamFull(@PathVariable int id) {
        try {
            ExamFullDTO examFullDTO = examService.getExamWithFullDetails(id);
            return ResponseEntity.ok(examFullDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Sınav bulunamadı: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Sınav detayları getirilemedi: " + e.getMessage());
        }
    }

    // ========== POST METODLARI ==========
    
    /**
     * ✅ YENİ SINAV OLUŞTUR - POST /api/exams/create
     * (Mevcut metodunuz, sadece path'i değiştirdim)
     */
    @PostMapping("/create")
    public ResponseEntity<?> createExam(@RequestBody ExamCreateDTO dto) {
        try {
            int examId = examService.createExamWithQuestions(dto);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Sınav başarıyla oluşturuldu");
            response.put("examId", examId);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Sınav oluşturulamadı: " + e.getMessage());
        }
    }
    
    /**
     * ✅ SINAV CEVAPLARINI GÖNDER VE PUANLA - POST /api/exams/submit
     */
    @PostMapping("/submit")
    public ResponseEntity<?> submitExam(@RequestBody ExamSubmissionDTO submission) {
        try {
            ExamResultDTO result = examService.submitExamAndCalculateScore(submission);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("Sınav gönderilemedi: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Sınav değerlendirilemedi: " + e.getMessage());
        }
    }
    
    /**
     * ✅ SINAV GÜNCELLE - POST /api/exams/update/{id}
     */
    @PostMapping("/update/{id}")
    public ResponseEntity<?> updateExam(@PathVariable int id, @RequestBody Exam exam) {
        try {
            exam.setId(id);
            examService.update(exam);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Sınav başarıyla güncellendi");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Sınav güncellenemedi: " + e.getMessage());
        }
    }
    
    /**
     * ✅ SINAV SİL - POST /api/exams/delete/{id}
     */
    @PostMapping("/delete/{id}")
    public ResponseEntity<?> deleteExam(@PathVariable int id) {
        try {
            Exam exam = examService.getById(id);
            if (exam == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Sınav bulunamadı: " + id);
            }
            
            examService.delete(exam);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Sınav başarıyla silindi");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Sınav silinemedi: " + e.getMessage());
        }
    }
}
