// DataAccess/ISinavlarDal.java
package com.True_Learners.Learny.DataAccess;

import java.util.List;
import com.True_Learners.Learny.Entities.Exam;

public interface ISinavlarDal {
    List<Exam> getAll();
    void add(Exam exam);
    void update(Exam exam);
    void delete(Exam exam);
    Exam getById(int id);

    List<Exam> getByCourseId(int courseId);
}
