// Business/IExamService.java
package com.True_Learners.Learny.Business;

import java.util.List;
import com.True_Learners.Learny.DTOs.ExamCreateDTO;
import com.True_Learners.Learny.DTOs.ExamFullDTO;
import com.True_Learners.Learny.DTOs.ExamResultDTO;
import com.True_Learners.Learny.DTOs.ExamSubmissionDTO;
import com.True_Learners.Learny.Entities.Exam;

/**
 * EXAM SERVICE INTERFACE
 * 
 * Sınav işlemleri için business logic metodları
 * 
 * CRUD İŞLEMLERİ:
 * - getAll, getById, add, update, delete
 * 
 * SINAV İŞLEMLERİ:
 * - getExamWithFullDetails: Sınav + Sorular + Seçenekler
 * - submitExamAndCalculateScore: Sınavı puanla ve kaydet
 * - createExamWithQuestions: Yeni sınav oluştur (sorular dahil)
 */
public interface IExamService {
    // Temel CRUD
    List<Exam> getAll();
    void add(Exam exam);
    void update(Exam exam);
    void delete(Exam exam);
    Exam getById(int id);
    List<Exam> getByCourseId(int courseId);
    
    /**
     * Sınav detaylarını sorular ve seçeneklerle birlikte getir
     * 
     * KULLANIM: Öğrenci sınava başladığında
     * 
     * @param examId Sınav ID
     * @return ExamFullDTO (sınav + sorular + seçenekler)
     */
    ExamFullDTO getExamWithFullDetails(int examId);
    
    /**
     * Sınavı puanla ve sonucu kaydet
     * 
     * KULLANIM: Öğrenci sınavı bitirdiğinde
     * 
     * AKIŞ:
     * 1. Cevapları doğru cevaplarla karşılaştır
     * 2. Puanı hesapla
     * 3. Sonucu veritabanına kaydet
     * 4. Detaylı sonuç bilgilerini döndür
     * 
     * @param submission Öğrencinin cevapları
     * @return ExamResultDTO (puan + detaylar)
     */
    ExamResultDTO submitExamAndCalculateScore(ExamSubmissionDTO submission);
    
    /**
     * Yeni sınav oluştur (sorular ve seçenekler dahil)
     * 
     * KULLANIM: Öğretmen yeni sınav eklerken
     * 
     * @param examCreateDTO Sınav bilgileri + Sorular + Seçenekler
     * @return Oluşturulan sınav ID
     */
    int createExamWithQuestions(ExamCreateDTO examCreateDTO);
}