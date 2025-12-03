// src/main/java/com/True_Learners/Learny/restAPI/ExamResultController.java
package com.True_Learners.Learny.restAPI;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.True_Learners.Learny.Business.IExamResultService;
import com.True_Learners.Learny.Entities.ExamResult;

/**
 * EXAM RESULT CONTROLLER
 * 
 * Sınav sonuçları için REST API endpoint'leri
 * 
 * ENDPOINT'LER:
 * - GET /api/results              - Tüm sonuçları getir
 * - GET /api/results/{id}         - ID'ye göre sonuç getir
 * - GET /api/results/student/{id} - Öğrenciye göre sonuçları getir
 * - GET /api/results/exam/{id}    - Sınava göre sonuçları getir
 * - POST /api/results/add         - Yeni sonuç ekle
 * - POST /api/results/update/{id} - Sonuç güncelle
 * - POST /api/results/delete/{id} - Sonuç sil
 */
@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "http://localhost:5173")
public class ExamResultController {

    private final IExamResultService resultService;

    @Autowired
    public ExamResultController(IExamResultService resultService) {
        this.resultService = resultService;
    }

    /**
     * Tüm sonuçları getir
     */
    @GetMapping
    public ResponseEntity<List<ExamResult>> getAll() {
        List<ExamResult> results = resultService.getAll();
        return ResponseEntity.ok(results);
    }

    /**
     * ID'ye göre sonuç getir
     */
    @GetMapping("/{id}")
    public ResponseEntity<ExamResult> getById(@PathVariable int id) {
        ExamResult result = resultService.getById(id);
        if (result == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(result);
    }

    /**
     * Öğrenciye göre sonuçları getir
     * 
     * ENDPOINT: GET /api/results/student/{studentId}
     * 
     * KULLANIM: Öğrencinin tamamladığı tüm sınav sonuçlarını listele
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ExamResult>> getByStudent(@PathVariable int studentId) {
        List<ExamResult> results = resultService.getByStudentId(studentId);
        return ResponseEntity.ok(results);
    }

    /**
     * Sınava göre sonuçları getir
     * 
     * ENDPOINT: GET /api/results/exam/{examId}
     * 
     * KULLANIM: Bir sınava giren tüm öğrencilerin sonuçlarını listele
     * (Öğretmenler için detaylı analiz)
     */
    @GetMapping("/exam/{examId}")
    public ResponseEntity<List<ExamResult>> getByExam(@PathVariable int examId) {
        List<ExamResult> results = resultService.getByExamId(examId);
        return ResponseEntity.ok(results);
    }

    /**
     * Yeni sonuç ekle
     */
    @PostMapping("/add")
    public ResponseEntity<String> add(@RequestBody ExamResult result) {
        resultService.add(result);
        return ResponseEntity.ok("Sonuç başarıyla eklendi");
    }

    /**
     * Sonuç güncelle
     */
    @PostMapping("/update/{id}")
    public ResponseEntity<String> update(@PathVariable int id, @RequestBody ExamResult result) {
        result.setId(id);
        resultService.update(result);
        return ResponseEntity.ok("Sonuç başarıyla güncellendi");
    }

    /**
     * Sonuç sil
     */
    @PostMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable int id) {
        ExamResult result = resultService.getById(id);
        if (result == null) {
            return ResponseEntity.notFound().build();
        }
        resultService.delete(result);
        return ResponseEntity.ok("Sonuç başarıyla silindi");
    }
}
