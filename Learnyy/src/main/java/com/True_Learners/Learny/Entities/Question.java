// src/main/java/com/True_Learners/Learny/Entities/Question.java
package com.True_Learners.Learny.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "Sorular")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Soruid")
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Sinavid", nullable = false)
    private Exam exam;

    @Column(name = "SoruMetni", nullable = false, columnDefinition = "TEXT")
    private String text;

    @Enumerated(EnumType.STRING)
    @Column(name = "SoruTipi", nullable = false)
    private QuestionType type;

    public enum QuestionType {
        CoktanSecmeli, DogruYanlis
    }

    public Question() {
    }

    public Question(int id, Exam exam, String text, QuestionType type) {
        this.id = id;
        this.exam = exam;
        this.text = text;
        this.type = type;
    }

    // --- GETTER & SETTER ---

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Exam getExam() {
        return exam;
    }

    public void setExam(Exam exam) {
        this.exam = exam;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public QuestionType getType() {
        return type;
    }

    public void setType(QuestionType type) {
        this.type = type;
    }
}
