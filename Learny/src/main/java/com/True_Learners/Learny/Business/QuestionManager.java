// src/main/java/com/True_Learners/Learny/Business/QuestionManager.java
package com.True_Learners.Learny.Business;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.True_Learners.Learny.DataAccess.ISorularDal;
import com.True_Learners.Learny.Entities.Question;

@Service
public class QuestionManager implements IQuestionService {

    private final ISorularDal sorularDal;

    @Autowired
    public QuestionManager(ISorularDal sorularDal) {
        this.sorularDal = sorularDal;
    }

    @Override
    @Transactional
    public List<Question> getAll() {
        return sorularDal.getAll();
    }

    @Override
    @Transactional
    public void add(Question question) {
        sorularDal.add(question);
    }

    @Override
    @Transactional
    public void update(Question question) {
        sorularDal.update(question);
    }

    @Override
    @Transactional
    public void delete(Question question) {
        sorularDal.delete(question);
    }

    @Override
    @Transactional
    public Question getById(int id) {
        return sorularDal.getById(id);
    }

    @Override
    @Transactional
    public List<Question> getByExamId(int examId) {
        return sorularDal.getByExamId(examId);
    }
}
