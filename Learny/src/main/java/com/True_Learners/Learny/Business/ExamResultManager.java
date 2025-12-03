// src/main/java/com/True_Learners/Learny/Business/ExamResultManager.java
package com.True_Learners.Learny.Business;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.True_Learners.Learny.DataAccess.IOgrenciSinavSonuclariDal;
import com.True_Learners.Learny.Entities.ExamResult;

/**
 * EXAM RESULT MANAGER
 * 
 * Sınav sonuçları için business logic implementasyonu
 */
@Service
public class ExamResultManager implements IExamResultService {
    
    private final IOgrenciSinavSonuclariDal resultDal;
    
    @Autowired
    public ExamResultManager(IOgrenciSinavSonuclariDal resultDal) {
        this.resultDal = resultDal;
    }
    
    @Override
    @Transactional
    public List<ExamResult> getAll() {
        return resultDal.getAll();
    }
    
    @Override
    @Transactional
    public void add(ExamResult result) {
        resultDal.add(result);
    }
    
    @Override
    @Transactional
    public void update(ExamResult result) {
        resultDal.update(result);
    }
    
    @Override
    @Transactional
    public void delete(ExamResult result) {
        resultDal.delete(result);
    }
    
    @Override
    @Transactional
    public ExamResult getById(int id) {
        return resultDal.getById(id);
    }
    
    @Override
    @Transactional
    public List<ExamResult> getByStudentId(int studentId) {
        return resultDal.getByStudentId(studentId);
    }
    
    @Override
    @Transactional
    public List<ExamResult> getByExamId(int examId) {
        return resultDal.getByExamId(examId);
    }
}
