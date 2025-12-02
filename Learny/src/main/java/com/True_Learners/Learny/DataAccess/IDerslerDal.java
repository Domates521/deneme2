// DataAccess/IDerslerDal.java
package com.True_Learners.Learny.DataAccess;

import java.util.List;
import com.True_Learners.Learny.Entities.Course;

public interface IDerslerDal {
    List<Course> getAll();
    void add(Course course);
    void update(Course course);
    void delete(Course course);
    Course getById(int id);

    List<Course> getByTeacherId(int teacherId);
}
