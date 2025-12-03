// src/main/java/com/True_Learners/Learny/DTOs/ExamSubmissionDTO.java
package com.True_Learners.Learny.DTOs;

import java.util.List;

/**
 * EXAM SUBMISSION DTO
 * 
 * BU DTO NE İŞE YARAR?
 * - Öğrenci sınavı bitirdiğinde cevaplarını backend'e gönderir
 * - Backend bu cevapları alır, doğru cevaplarla karşılaştırır
 * - Puanı hesaplar ve kaydeder
 * 
 * AKIŞ:
 * Frontend -> POST /api/exams/submit -> Backend
 * 
 * İÇERİK:
 * - Sınav ID
 * - Öğrenci ID
 * - Her soru için: Soru ID + Seçilen seçenek ID(leri)
 * 
 * ÖRNEK JSON:
 * {
 *   "examId": 1,
 *   "studentId": 6,
 *   "answers": [
 *     { "questionId": 1, "selectedOptionIds": [3] },
 *     { "questionId": 2, "selectedOptionIds": [7] },
 *     { "questionId": 3, "selectedOptionIds": [11, 12] }
 *   ]
 * }
 */
public class ExamSubmissionDTO {
    
    private int examId;
    private int studentId;
    private List<AnswerDTO> answers;
    
    // Constructors
    public ExamSubmissionDTO() {}
    
    public ExamSubmissionDTO(int examId, int studentId, List<AnswerDTO> answers) {
        this.examId = examId;
        this.studentId = studentId;
        this.answers = answers;
    }
    
    // Getters and Setters
    public int getExamId() {
        return examId;
    }
    
    public void setExamId(int examId) {
        this.examId = examId;
    }
    
    public int getStudentId() {
        return studentId;
    }
    
    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }
    
    public List<AnswerDTO> getAnswers() {
        return answers;
    }
    
    public void setAnswers(List<AnswerDTO> answers) {
        this.answers = answers;
    }
    
    /**
     * ANSWER DTO (İç sınıf)
     * 
     * Her cevap için:
     * - Soru ID
     * - Seçilen seçenek ID(leri)
     * 
     * NOT:
     * - Çoktan seçmeli: 1 seçenek ID
     * - Çoklu seçim: Birden fazla seçenek ID
     * - Boş cevap: selectedOptionIds = [] (boş liste)
     */
    public static class AnswerDTO {
        private int questionId;
        private List<Integer> selectedOptionIds;
        
        public AnswerDTO() {}
        
        public AnswerDTO(int questionId, List<Integer> selectedOptionIds) {
            this.questionId = questionId;
            this.selectedOptionIds = selectedOptionIds;
        }
        
        // Getters and Setters
        public int getQuestionId() {
            return questionId;
        }
        
        public void setQuestionId(int questionId) {
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