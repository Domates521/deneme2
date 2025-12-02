// Business/ICourseService.java
package com.True_Learners.Learny.Business;

import java.util.List;
import com.True_Learners.Learny.Entities.Course;

public interface ICourseService {
    List<Course> getAll();
    void add(Course course);
    void update(Course course);
    void delete(Course course);
    Course getById(int id);

    List<Course> getByTeacherId(int teacherId);
}
