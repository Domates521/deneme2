// src/main/java/com/True_Learners/Learny/Entities/OptionChoice.java
package com.True_Learners.Learny.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "Secenekler")
public class Option {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Secenekid")
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Soruid", nullable = false)
    private Question question;

    @Column(name = "Secenekmetni", nullable = false, length = 255)
    private String text;

    @Column(name = "Dogrumu", nullable = false)
    private boolean correct;

    public Option() {
    }

    public Option(int id, Question question, String text, boolean correct) {
        this.id = id;
        this.question = question;
        this.text = text;
        this.correct = correct;
    }

    // --- GETTER & SETTER ---

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public boolean isCorrect() {
        return correct;
    }

    public void setCorrect(boolean correct) {
        this.correct = correct;
    }
}
