// src/main/java/com/True_Learners/Learny/DTOs/ExamFullDTO.java
package com.True_Learners.Learny.DTOs;

import java.time.LocalDateTime;
import java.util.List;

/**
 * ✅ EXAM FULL DTO
 * 
 * Öğrenci sınava başladığında backend'den gelen tam sınav verisi
 * Sorular ve seçenekler dahil (ama doğru cevaplar gizli)
 */
public class ExamFullDTO {
    
    private Integer examId;
    private String title;
    private String description;
    private Integer durationMinutes;
    private LocalDateTime createdAt;
    private Integer courseId;
    private String courseName;
    private List<QuestionDTO> questions;
    
    // ========== CONSTRUCTORS ==========
    
    public ExamFullDTO() {
    }
    
    // ========== GETTERS & SETTERS ==========
    
    public Integer getExamId() {
        return examId;
    }
    
    public void setExamId(Integer examId) {
        this.examId = examId;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Integer getDurationMinutes() {
        return durationMinutes;
    }
    
    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public Integer getCourseId() {
        return courseId;
    }
    
    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }
    
    public String getCourseName() {
        return courseName;
    }
    
    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }
    
    public List<QuestionDTO> getQuestions() {
        return questions;
    }
    
    public void setQuestions(List<QuestionDTO> questions) {
        this.questions = questions;
    }
    
    // ========== NESTED CLASS: QUESTION DTO ==========
    
    public static class QuestionDTO {
        
        private Integer questionId;
        private String text;
        private String type;
        private List<OptionDTO> options;
        
        public QuestionDTO() {
        }
        
        public QuestionDTO(Integer questionId, String text, String type, List<OptionDTO> options) {
            this.questionId = questionId;
            this.text = text;
            this.type = type;
            this.options = options;
        }
        
        public Integer getQuestionId() {
            return questionId;
        }
        
        public void setQuestionId(Integer questionId) {
            this.questionId = questionId;
        }
        
        public String getText() {
            return text;
        }
        
        public void setText(String text) {
            this.text = text;
        }
        
        public String getType() {
            return type;
        }
        
        public void setType(String type) {
            this.type = type;
        }
        
        public List<OptionDTO> getOptions() {
            return options;
        }
        
        public void setOptions(List<OptionDTO> options) {
            this.options = options;
        }
    }
    
    // ========== NESTED CLASS: OPTION DTO ==========
    
    public static class OptionDTO {
        
        private Integer optionId;
        private String text;
        // NOT: isCorrect alanı YOK - öğrenciye gösterilmez!
        
        public OptionDTO() {
        }
        
        public OptionDTO(Integer optionId, String text) {
            this.optionId = optionId;
            this.text = text;
        }
        
        public Integer getOptionId() {
            return optionId;
        }
        
        public void setOptionId(Integer optionId) {
            this.optionId = optionId;
        }
        
        public String getText() {
            return text;
        }
        
        public void setText(String text) {
            this.text = text;
        }
    }
}
