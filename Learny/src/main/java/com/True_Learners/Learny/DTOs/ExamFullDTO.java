// src/main/java/com/True_Learners/Learny/DTOs/ExamFullDTO.java
package com.True_Learners.Learny.DTOs;

import java.time.LocalDateTime;
import java.util.List;

/**
 * EXAM FULL DTO
 * 
 * BU DTO NE İŞE YARAR?
 * - Öğrenci sınava başladığında backend'den tam sınav verilerini alır
 * - Sınav bilgileri + Sorular + Her sorunun seçenekleri
 * - Frontend'de sınav sayfasını render etmek için kullanılır
 * 
 * İÇERİK:
 * - Sınav temel bilgileri (başlık, açıklama, süre)
 * - Tüm sorular (liste)
 * - Her sorunun seçenekleri (nested liste)
 * 
 * GÜVENLİK:
 * - Seçeneklerde "doğru" bilgisi GÖNDERİLMEZ
 * - Öğrenci doğru cevapları göremez
 * - Sadece soru metinleri ve seçenek metinleri gider
 */
public class ExamFullDTO {
    
    // Sınav bilgileri
    private int examId;
    private String title;
    private String description;
    private int durationMinutes;
    private LocalDateTime createdAt;
    
    // Ders bilgisi
    private int courseId;
    private String courseName;
    
    // Sorular ve seçenekleri
    private List<QuestionDTO> questions;
    
    // Constructors
    public ExamFullDTO() {}
    
    public ExamFullDTO(int examId, String title, String description, int durationMinutes,
                       LocalDateTime createdAt, int courseId, String courseName,
                       List<QuestionDTO> questions) {
        this.examId = examId;
        this.title = title;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.createdAt = createdAt;
        this.courseId = courseId;
        this.courseName = courseName;
        this.questions = questions;
    }
    
    // Getters and Setters
    public int getExamId() {
        return examId;
    }
    
    public void setExamId(int examId) {
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
    
    public int getDurationMinutes() {
        return durationMinutes;
    }
    
    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public int getCourseId() {
        return courseId;
    }
    
    public void setCourseId(int courseId) {
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
    
    /**
     * QUESTION DTO (İç sınıf)
     * 
     * Her soru için:
     * - Soru ID
     * - Soru metni
     * - Soru tipi (CoktanSecmeli / DogruYanlis)
     * - Seçenekler listesi
     */
    public static class QuestionDTO {
        private int questionId;
        private String text;
        private String type; // "CoktanSecmeli" veya "DogruYanlis"
        private List<OptionDTO> options;
        
        public QuestionDTO() {}
        
        public QuestionDTO(int questionId, String text, String type, List<OptionDTO> options) {
            this.questionId = questionId;
            this.text = text;
            this.type = type;
            this.options = options;
        }
        
        // Getters and Setters
        public int getQuestionId() {
            return questionId;
        }
        
        public void setQuestionId(int questionId) {
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
    
    /**
     * OPTION DTO (İç sınıf)
     * 
     * Her seçenek için:
     * - Seçenek ID
     * - Seçenek metni
     * 
     * ÖNEMLİ: "doğru" bilgisi burada YOK!
     * Öğrenci doğru cevabı göremez.
     */
    public static class OptionDTO {
        private int optionId;
        private String text;
        
        public OptionDTO() {}
        
        public OptionDTO(int optionId, String text) {
            this.optionId = optionId;
            this.text = text;
        }
        
        // Getters and Setters
        public int getOptionId() {
            return optionId;
        }
        
        public void setOptionId(int optionId) {
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