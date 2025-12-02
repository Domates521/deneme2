// src/main/java/com/True_Learners/Learny/Business/IOptionService.java
package com.True_Learners.Learny.Business;

import java.util.List;

import com.True_Learners.Learny.Entities.Option;

public interface IOptionService {
    List<Option> getAll();
    void add(Option option);
    void update(Option option);
    void delete(Option option);
    Option getById(int id);

    List<Option> getByQuestionId(int questionId);
}
