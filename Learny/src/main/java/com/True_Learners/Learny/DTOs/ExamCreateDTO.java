// src/main/java/com/True_Learners/Learny/DTOs/ExamCreateDTO.java
package com.True_Learners.Learny.DTOs;

import java.util.List;

/**
 * ✅ EXAM CREATE DTO
 * 
 * Öğretmen yeni sınav oluştururken frontend'den gelen veri
 * 
 * Nested class'lar içerir:
 * - QuestionCreateDTO: Soru bilgileri
 * - OptionCreateDTO: Seçenek bilgileri
 */
public class ExamCreateDTO {
    
    private String title;
    private String description;
    private Integer durationMinutes;
    private Integer courseId;
    private List<QuestionCreateDTO> questions;
    
    // ========== CONSTRUCTORS ==========
    
    public ExamCreateDTO() {
    }
    
    public ExamCreateDTO(String title, String description, Integer durationMinutes, 
                        Integer courseId, List<QuestionCreateDTO> questions) {
        this.title = title;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.courseId = courseId;
        this.questions = questions;
    }
    
    // ========== GETTERS & SETTERS ==========
    
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
    
    public Integer getCourseId() {
        return courseId;
    }
    
    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }
    
    public List<QuestionCreateDTO> getQuestions() {
        return questions;
    }
    
    public void setQuestions(List<QuestionCreateDTO> questions) {
        this.questions = questions;
    }
    
    // ========== NESTED CLASS: QUESTION CREATE DTO ==========
    
    /**
     * Soru bilgilerini taşır
     */
    public static class QuestionCreateDTO {
        
        private String text;
        private String type; // "CoktanSecmeli" veya "DogruYanlis"
        private List<OptionCreateDTO> options;
        
        public QuestionCreateDTO() {
        }
        
        public QuestionCreateDTO(String text, String type, List<OptionCreateDTO> options) {
            this.text = text;
            this.type = type;
            this.options = options;
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
        
        public List<OptionCreateDTO> getOptions() {
            return options;
        }
        
        public void setOptions(List<OptionCreateDTO> options) {
            this.options = options;
        }
    }
    
    // ========== NESTED CLASS: OPTION CREATE DTO ==========
    
    /**
     * Seçenek bilgilerini taşır
     */
    public static class OptionCreateDTO {
        
        private String text;
        private Boolean isCorrect;
        
        public OptionCreateDTO() {
        }
        
        public OptionCreateDTO(String text, Boolean isCorrect) {
            this.text = text;
            this.isCorrect = isCorrect;
        }
        
        public String getText() {
            return text;
        }
        
        public void setText(String text) {
            this.text = text;
        }
        
        public Boolean getIsCorrect() {
            return isCorrect;
        }
        
        public void setIsCorrect(Boolean isCorrect) {
            this.isCorrect = isCorrect;
        }
    }
}
