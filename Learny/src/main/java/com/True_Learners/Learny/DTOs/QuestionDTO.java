package com.True_Learners.Learny.DTOs;

import com.True_Learners.Learny.Entities.Question.QuestionType;
import java.util.List;

public class QuestionDTO {
    private String text;
    private QuestionType type;
    private List<OptionDTO> options;

    // Constructors
    public QuestionDTO() {
    }

    public QuestionDTO(String text, QuestionType type, List<OptionDTO> options) {
        this.text = text;
        this.type = type;
        this.options = options;
    }

    // Getters & Setters
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

    public List<OptionDTO> getOptions() {
        return options;
    }

    public void setOptions(List<OptionDTO> options) {
        this.options = options;
    }
}