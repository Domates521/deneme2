// src/main/java/com/True_Learners/Learny/Business/OptionChoiceManager.java
package com.True_Learners.Learny.Business;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.True_Learners.Learny.DataAccess.ISeceneklerDal;
import com.True_Learners.Learny.Entities.Option;

@Service
public class OptionManager implements IOptionService {

    private final ISeceneklerDal seceneklerDal;

    @Autowired
    public OptionManager(ISeceneklerDal seceneklerDal) {
        this.seceneklerDal = seceneklerDal;
    }

    @Override
    @Transactional
    public List<Option> getAll() {
        return seceneklerDal.getAll();
    }

    @Override
    @Transactional
    public void add(Option option) {
        seceneklerDal.add(option);
    }

    @Override
    @Transactional
    public void update(Option option) {
        seceneklerDal.update(option);
    }

    @Override
    @Transactional
    public void delete(Option option) {
        seceneklerDal.delete(option);
    }

    @Override
    @Transactional
    public Option getById(int id) {
        return seceneklerDal.getById(id);
    }

    @Override
    @Transactional
    public List<Option> getByQuestionId(int questionId) {
        return seceneklerDal.getByQuestionId(questionId);
    }
}
