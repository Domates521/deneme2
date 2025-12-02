// src/main/java/com/True_Learners/Learny/Business/IQuestionService.java
package com.True_Learners.Learny.Business;

import java.util.List;

import com.True_Learners.Learny.Entities.Question;

public interface IQuestionService {
    List<Question> getAll();
    void add(Question question);
    void update(Question question);
    void delete(Question question);
    Question getById(int id);

    List<Question> getByExamId(int examId);
}
