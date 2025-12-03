// src/main/java/com/True_Learners/Learny/DTOs/ExamResultDTO.java
package com.True_Learners.Learny.DTOs;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * ✅ EXAM RESULT DTO
 * 
 * Sınav puanlandıktan sonra backend'den dönen sonuç
 */
public class ExamResultDTO {
    
    private Integer resultId;
    private Integer examId;
    private String examTitle;
    private Integer studentId;
    private String studentName;
    private BigDecimal score; // 0-100 arası puan
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer wrongAnswers;
    private LocalDateTime finishedAt;
    
    // ========== CONSTRUCTORS ==========
    
    public ExamResultDTO() {
    }
    
    public ExamResultDTO(Integer resultId, Integer examId, String examTitle, 
                        Integer studentId, String studentName, BigDecimal score,
                        Integer totalQuestions, Integer correctAnswers, 
                        Integer wrongAnswers, LocalDateTime finishedAt) {
        this.resultId = resultId;
        this.examId = examId;
        this.examTitle = examTitle;
        this.studentId = studentId;
        this.studentName = studentName;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
        this.wrongAnswers = wrongAnswers;
        this.finishedAt = finishedAt;
    }
    
    // ========== GETTERS & SETTERS ==========
    
    public Integer getResultId() {
        return resultId;
    }
    
    public void setResultId(Integer resultId) {
        this.resultId = resultId;
    }
    
    public Integer getExamId() {
        return examId;
    }
    
    public void setExamId(Integer examId) {
        this.examId = examId;
    }
    
    public String getExamTitle() {
        return examTitle;
    }
    
    public void setExamTitle(String examTitle) {
        this.examTitle = examTitle;
    }
    
    public Integer getStudentId() {
        return studentId;
    }
    
    public void setStudentId(Integer studentId) {
        this.studentId = studentId;
    }
    
    public String getStudentName() {
        return studentName;
    }
    
    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }
    
    public BigDecimal getScore() {
        return score;
    }
    
    public void setScore(BigDecimal score) {
        this.score = score;
    }
    
    public Integer getTotalQuestions() {
        return totalQuestions;
    }
    
    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }
    
    public Integer getCorrectAnswers() {
        return correctAnswers;
    }
    
    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }
    
    public Integer getWrongAnswers() {
        return wrongAnswers;
    }
    
    public void setWrongAnswers(Integer wrongAnswers) {
        this.wrongAnswers = wrongAnswers;
    }
    
    public LocalDateTime getFinishedAt() {
        return finishedAt;
    }
    
    public void setFinishedAt(LocalDateTime finishedAt) {
        this.finishedAt = finishedAt;
    }
}
