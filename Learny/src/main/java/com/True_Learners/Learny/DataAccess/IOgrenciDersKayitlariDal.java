// DataAccess/IOgrenciDersKayitlariDal.java
package com.True_Learners.Learny.DataAccess;

import java.util.List;
import com.True_Learners.Learny.Entities.Enrollment;

public interface IOgrenciDersKayitlariDal {
    List<Enrollment> getAll();
    void add(Enrollment enrollment);
    void update(Enrollment enrollment);
    void delete(Enrollment enrollment);
    Enrollment getById(int id);

    List<Enrollment> getByStudentId(int studentId);
    List<Enrollment> getByCourseId(int courseId);
}
