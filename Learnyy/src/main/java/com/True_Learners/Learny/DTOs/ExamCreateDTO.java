// src/main/java/com/True_Learners/Learny/DTOs/ExamCreateDTO.java
package com.True_Learners.Learny.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

/**
 * EXAM CREATE DTO
 * 
 * BU DTO NE İŞE YARAR?
 * - Öğretmen yeni sınav oluştururken bu DTO kullanılır
 * - Sınav bilgileri + Sorular + Her sorunun seçenekleri
 * - Backend'e POST /api/exams/create ile gönderilir
 * 
 * VALİDASYON:
 * - @NotBlank: Boş olmamalı
 * - @NotNull: Null olmamalı
 * - @Size: Minimum/Maximum uzunluk kontrolü
 * 
 * KULLANIM:
 * Frontend'de öğretmen formu doldurur:
 * 1. Sınav başlığı, açıklama, süre
 * 2. Dersi seçer
 * 3. Soruları ekler
 * 4. Her soru için seçenekleri ekler ve doğru cevabı işaretler
 */
public class ExamCreateDTO {
    
    @NotBlank(message = "Sınav başlığı boş olamaz")
    @Size(max = 150, message = "Başlık en fazla 150 karakter olabilir")
    private String title;
    
    private String description; // Opsiyonel
    
    @NotNull(message = "Süre belirtilmelidir")
    private Integer durationMinutes;
    
    @NotNull(message = "Ders seçilmelidir")
    private Integer courseId;
    
    @NotNull(message = "En az bir soru eklenmelidir")
    @Size(min = 1, message = "En az bir soru eklenmelidir")
    private List<QuestionCreateDTO> questions;
    
    // Constructors
    public ExamCreateDTO() {}
    
    public ExamCreateDTO(String title, String description, Integer durationMinutes,
                        Integer courseId, List<QuestionCreateDTO> questions) {
        this.title = title;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.courseId = courseId;
        this.questions = questions;
    }
    
    // Getters and Setters
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
    
    /**
     * QUESTION CREATE DTO (İç sınıf)
     * 
     * Her soru için:
     * - Soru metni
     * - Soru tipi (CoktanSecmeli / DogruYanlis)
     * - Seçenekler listesi
     */
    public static class QuestionCreateDTO {
        
        @NotBlank(message = "Soru metni boş olamaz")
        private String text;
        
        @NotBlank(message = "Soru tipi belirtilmelidir")
        private String type; // "CoktanSecmeli" veya "DogruYanlis"
        
        @NotNull(message = "En az bir seçenek eklenmelidir")
        @Size(min = 1, message = "En az bir seçenek eklenmelidir")
        private List<OptionCreateDTO> options;
        
        public QuestionCreateDTO() {}
        
        public QuestionCreateDTO(String text, String type, List<OptionCreateDTO> options) {
            this.text = text;
            this.type = type;
            this.options = options;
        }
        
        // Getters and Setters
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
    
    /**
     * OPTION CREATE DTO (İç sınıf)
     * 
     * Her seçenek için:
     * - Seçenek metni
     * - Doğru mu? (true/false)
     */
    public static class OptionCreateDTO {
        
        @NotBlank(message = "Seçenek metni boş olamaz")
        @Size(max = 255, message = "Seçenek metni en fazla 255 karakter olabilir")
        private String text;
        
        @NotNull(message = "Doğru/Yanlış bilgisi belirtilmelidir")
        private Boolean isCorrect;
        
        public OptionCreateDTO() {}
        
        public OptionCreateDTO(String text, Boolean isCorrect) {
            this.text = text;
            this.isCorrect = isCorrect;
        }
        
        // Getters and Setters
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