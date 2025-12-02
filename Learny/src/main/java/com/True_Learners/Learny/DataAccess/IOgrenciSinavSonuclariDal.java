// DataAccess/IOgrenciSinavSonuclariDal.java
package com.True_Learners.Learny.DataAccess;

import java.util.List;
import com.True_Learners.Learny.Entities.ExamResult;

public interface IOgrenciSinavSonuclariDal {
    List<ExamResult> getAll();
    void add(ExamResult result);
    void update(ExamResult result);
    void delete(ExamResult result);
    ExamResult getById(int id);

    List<ExamResult> getByStudentId(int studentId);
    List<ExamResult> getByExamId(int examId);
}
