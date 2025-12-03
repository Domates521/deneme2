// src/main/java/com/True_Learners/Learny/Business/IEnrollmentService.java
package com.True_Learners.Learny.Business;

import java.util.List;

import com.True_Learners.Learny.Entities.Enrollment;

public interface IEnrollmentService {
    List<Enrollment> getAll();
    void add(Enrollment enrollment);
    void update(Enrollment enrollment);
    void delete(Enrollment enrollment);
    Enrollment getById(int id);

    List<Enrollment> getByStudentId(int studentId);
    List<Enrollment> getByCourseId(int courseId);
}
