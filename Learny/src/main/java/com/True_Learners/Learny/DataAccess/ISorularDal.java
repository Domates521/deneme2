// DataAccess/ISorularDal.java
package com.True_Learners.Learny.DataAccess;

import java.util.List;
import com.True_Learners.Learny.Entities.Question;

public interface ISorularDal {
    List<Question> getAll();
    void add(Question question);
    void update(Question question);
    void delete(Question question);
    Question getById(int id);

    List<Question> getByExamId(int examId);
}
