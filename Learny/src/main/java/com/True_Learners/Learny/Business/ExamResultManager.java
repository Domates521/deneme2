// Business/ExamResultManager.java
package com.True_Learners.Learny.Business;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.True_Learners.Learny.DataAccess.IOgrenciSinavSonuclariDal;
import com.True_Learners.Learny.Entities.ExamResult;

@Service
public class ExamResultManager implements IExamResultService {

    private final IOgrenciSinavSonuclariDal sonucDal;

    @Autowired
    public ExamResultManager(IOgrenciSinavSonuclariDal sonucDal) {
        this.sonucDal = sonucDal;
    }

    @Override
    @Transactional
    public List<ExamResult> getAll() {
        return sonucDal.getAll();
    }

    @Override
    @Transactional
    public void add(ExamResult result) {
        sonucDal.add(result);
    }

    @Override
    @Transactional
    public void update(ExamResult result) {
        sonucDal.update(result);
    }

    @Override
    @Transactional
    public void delete(ExamResult result) {
        sonucDal.delete(result);
    }

    @Override
    @Transactional
    public ExamResult getById(int id) {
        return sonucDal.getById(id);
    }

    @Override
    @Transactional
    public List<ExamResult> getByStudentId(int studentId) {
        return sonucDal.getByStudentId(studentId);
    }

    @Override
    @Transactional
    public List<ExamResult> getByExamId(int examId) {
        return sonucDal.getByExamId(examId);
    }
}
