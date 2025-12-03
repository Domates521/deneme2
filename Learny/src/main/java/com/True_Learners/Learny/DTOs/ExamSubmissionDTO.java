// src/main/java/com/True_Learners/Learny/DTOs/ExamSubmissionDTO.java
package com.True_Learners.Learny.DTOs;

import java.util.List;

/**
 * ✅ EXAM SUBMISSION DTO
 * 
 * Öğrenci sınavı bitirdiğinde frontend'den gelen cevaplar
 */
public class ExamSubmissionDTO {
    
    private Integer examId;
    private Integer studentId;
    private List<AnswerDTO> answers;
    
    // ========== CONSTRUCTORS ==========
    
    public ExamSubmissionDTO() {
    }
    
    public ExamSubmissionDTO(Integer examId, Integer studentId, List<AnswerDTO> answers) {
        this.examId = examId;
        this.studentId = studentId;
        this.answers = answers;
    }
    
    // ========== GETTERS & SETTERS ==========
    
    public Integer getExamId() {
        return examId;
    }
    
    public void setExamId(Integer examId) {
        this.examId = examId;
    }
    
    public Integer getStudentId() {
        return studentId;
    }
    
    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }
    
    public List<AnswerDTO> getAnswers() {
        return answers;
    }
    
    public void setAnswers(List<AnswerDTO> answers) {
        this.answers = answers;
    }
    
    // ========== NESTED CLASS: ANSWER DTO ==========
    
    /**
     * Tek bir soru için öğrencinin cevabı
     */
    public static class AnswerDTO {
        
        private Integer questionId;
        private List<Integer> selectedOptionIds;
        
        public AnswerDTO() {
        }
        
        public AnswerDTO(Integer questionId, List<Integer> selectedOptionIds) {
            this.questionId = questionId;
            this.selectedOptionIds = selectedOptionIds;
        }
        
        public Integer getQuestionId() {
            return questionId;
        }
        
        public void setQuestionId(Integer questionId) {
            this.questionId = questionId;
        }
        
        public List<Integer> getSelectedOptionIds() {
            return selectedOptionIds;
        }
        
        public void setSelectedOptionIds(List<Integer> selectedOptionIds) {
            this.selectedOptionIds = selectedOptionIds;
        }
    }
}
