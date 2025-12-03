package com.True_Learners.Learny.DTOs;

public class OptionDTO {
    private String text;
    private boolean correct;

    // Constructors
    public OptionDTO() {
    }

    public OptionDTO(String text, boolean correct) {
        this.text = text;
        this.correct = correct;
    }

    // Getters & Setters
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