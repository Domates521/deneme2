// src/main/java/com/True_Learners/Learny/Business/IExamService.java
package com.True_Learners.Learny.Business;

import com.True_Learners.Learny.DTOs.ExamCreateDTO;
import com.True_Learners.Learny.DTOs.ExamFullDTO;
import com.True_Learners.Learny.DTOs.ExamResultDTO;
import com.True_Learners.Learny.DTOs.ExamSubmissionDTO;
import com.True_Learners.Learny.Entities.Exam;

import java.util.List;

/**
 * ✅ EXAM SERVICE INTERFACE
 * 
 * ExamManager'ın implement ettiği tüm metodlar burada tanımlanmalı
 */
public interface IExamService {
    
    // Temel CRUD işlemleri
    List<Exam> getAll();
    Exam getById(int id);
    List<Exam> getByCourseId(int courseId);
    void add(Exam exam);
    void update(Exam exam);
    void delete(Exam exam);
    
    // Sınav detayları (sorular + seçenekler)
    ExamFullDTO getExamWithFullDetails(int examId);
    
    // Sınav oluşturma
    int createExamWithQuestions(ExamCreateDTO dto);
    
    // Sınav puanlama
    ExamResultDTO submitExamAndCalculateScore(ExamSubmissionDTO submission);
}
