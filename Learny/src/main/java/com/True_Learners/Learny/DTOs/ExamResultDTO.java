// src/main/java/com/True_Learners/Learny/DTOs/ExamResultDTO.java
package com.True_Learners.Learny.DTOs;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * EXAM RESULT DTO
 * 
 * BU DTO NE İŞE YARAR?
 * - Sınav bittiğinde backend'den sonuç bilgilerini frontend'e taşır
 * - Öğrenci puanını, doğru/yanlış sayısını, detayları görür
 * 
 * İÇERİK:
 * - Toplam puan
 * - Doğru cevap sayısı
 * - Yanlış cevap sayısı
 * - Boş cevap sayısı
 * - Her sorunun detayı (doğru mu yanlış mı, doğru cevap neydi)
 * 
 * KULLANIM:
 * Sınav bitince sonuç sayfasında gösterilir
 */
public class ExamResultDTO {
    
    private int resultId;
    private int examId;
    private String examTitle;
    private int studentId;
    private String studentName;
    
    // Puan bilgileri
    private BigDecimal score; // Toplam puan (örn: 85.50)
    private int totalQuestions;
    private int correctAnswers;
    private int wrongAnswers;
    private int emptyAnswers;
    
    // Zaman bilgisi
    private LocalDateTime finishedAt;
    
    // Her sorunun detayı
    private List<QuestionResultDTO> questionResults;
    
    // Constructors
    public ExamResultDTO() {}
    
    public ExamResultDTO(int resultId, int examId, String examTitle, int studentId, 
                        String studentName, BigDecimal score, int totalQuestions,
                        int correctAnswers, int wrongAnswers, int emptyAnswers,
                        LocalDateTime finishedAt, List<QuestionResultDTO> questionResults) {
        this.resultId = resultId;
        this.examId = examId;
        this.examTitle = examTitle;
        this.studentId = studentId;
        this.studentName = studentName;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
        this.wrongAnswers = wrongAnswers;
        this.emptyAnswers = emptyAnswers;
        this.finishedAt = finishedAt;
        this.questionResults = questionResults;
    }
    
    // Getters and Setters
    public int getResultId() {
        return resultId;
    }
    
    public void setResultId(int resultId) {
        this.resultId = resultId;
    }
    
    public int getExamId() {
        return examId;
    }
    
    public void setExamId(int examId) {
        this.examId = examId;
    }
    
    public String getExamTitle() {
        return examTitle;
    }
    
    public void setExamTitle(String examTitle) {
        this.examTitle = examTitle;
    }
    
    public int getStudentId() {
        return studentId;
    }
    
    public void setStudentId(int studentId) {
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
    
    public int getTotalQuestions() {
        return totalQuestions;
    }
    
    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }
    
    public int getCorrectAnswers() {
        return correctAnswers;
    }
    
    public void setCorrectAnswers(int correctAnswers) {
        this.correctAnswers = correctAnswers;
    }
    
    public int getWrongAnswers() {
        return wrongAnswers;
    }
    
    public void setWrongAnswers(int wrongAnswers) {
        this.wrongAnswers = wrongAnswers;
    }
    
    public int getEmptyAnswers() {
        return emptyAnswers;
    }
    
    public void setEmptyAnswers(int emptyAnswers) {
        this.emptyAnswers = emptyAnswers;
    }
    
    public LocalDateTime getFinishedAt() {
        return finishedAt;
    }
    
    public void setFinishedAt(LocalDateTime finishedAt) {
        this.finishedAt = finishedAt;
    }
    
    public List<QuestionResultDTO> getQuestionResults() {
        return questionResults;
    }
    
    public void setQuestionResults(List<QuestionResultDTO> questionResults) {
        this.questionResults = questionResults;
    }
    
    /**
     * QUESTION RESULT DTO (İç sınıf)
     * 
     * Her soru için:
     * - Soru metni
     * - Öğrencinin cevabı
     * - Doğru cevap
     * - Doğru mu yanlış mı
     */
    public static class QuestionResultDTO {
        private int questionId;
        private String questionText;
        private boolean isCorrect;
        private String studentAnswer; // Öğrencinin seçtiği seçenek metni
        private String correctAnswer; // Doğru cevap metni
        
        public QuestionResultDTO() {}
        
        public QuestionResultDTO(int questionId, String questionText, boolean isCorrect,
                                String studentAnswer, String correctAnswer) {
            this.questionId = questionId;
            this.questionText = questionText;
            this.isCorrect = isCorrect;
            this.studentAnswer = studentAnswer;
            this.correctAnswer = correctAnswer;
        }
        
        public QuestionResultDTO(int id, String text, String string, Object object, List<Integer> correctOptionIds,
				boolean isCorrect2, boolean isEmpty) {
			// TODO Auto-generated constructor stub
		}

		// Getters and Setters
        public int getQuestionId() {
            return questionId;
        }
        
        public void setQuestionId(int questionId) {
            this.questionId = questionId;
        }
        
        public String getQuestionText() {
            return questionText;
        }
        
        public void setQuestionText(String questionText) {
            this.questionText = questionText;
        }
        
        public boolean isCorrect() {
            return isCorrect;
        }
        
        public void setCorrect(boolean correct) {
            isCorrect = correct;
        }
        
        public String getStudentAnswer() {
            return studentAnswer;
        }
        
        public void setStudentAnswer(String studentAnswer) {
            this.studentAnswer = studentAnswer;
        }
        
        public String getCorrectAnswer() {
            return correctAnswer;
        }
        
        public void setCorrectAnswer(String correctAnswer) {
            this.correctAnswer = correctAnswer;
        }
    }
}