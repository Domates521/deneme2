// src/main/java/com/True_Learners/Learny/Business/IExamResultService.java
package com.True_Learners.Learny.Business;

import java.util.List;

import com.True_Learners.Learny.Entities.ExamResult;

/**
 * EXAM RESULT SERVICE INTERFACE
 * 
 * Sınav sonuçları için business logic tanımları
 */
public interface IExamResultService {
    
    /**
     * Tüm sonuçları getir
     */
    List<ExamResult> getAll();
    
    /**
     * Yeni sonuç ekle
     */
    void add(ExamResult result);
    
    /**
     * Sonuç güncelle
     */
    void update(ExamResult result);
    
    /**
     * Sonuç sil
     */
    void delete(ExamResult result);
    
    /**
     * ID'ye göre sonuç getir
     */
    ExamResult getById(int id);
    
    /**
     * Öğrenciye göre sonuçları getir
     * 
     * @param studentId Öğrenci ID
     * @return Öğrencinin tüm sınav sonuçları
     */
    List<ExamResult> getByStudentId(int studentId);
    
    /**
     * Sınava göre sonuçları getir
     * 
     * @param examId Sınav ID
     * @return Sınava giren tüm öğrencilerin sonuçları
     */
    List<ExamResult> getByExamId(int examId);
}
