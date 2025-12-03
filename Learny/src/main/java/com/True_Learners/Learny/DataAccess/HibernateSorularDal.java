// DataAccess/HibernateSorularDal.java
package com.True_Learners.Learny.DataAccess;

import java.util.List;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.True_Learners.Learny.Entities.Question;

import jakarta.persistence.EntityManager;

@Repository
public class HibernateSorularDal implements ISorularDal {

    private final EntityManager entityManager;

    @Autowired
    public HibernateSorularDal(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    @Transactional
    public List<Question> getAll() {
        Session session = entityManager.unwrap(Session.class);
        return session.createQuery("from Question", Question.class).getResultList();
    }

    @Override
    @Transactional
    public void add(Question question) {
        entityManager.persist(question);
    }

    @Override
    @Transactional
    public void update(Question question) {
        entityManager.merge(question);
    }

    @Override
    @Transactional
    public void delete(Question question) {
        Question managed = entityManager.contains(question) ? question : entityManager.merge(question);
        entityManager.remove(managed);
    }

    @Override
    @Transactional
    public Question getById(int id) {
        return entityManager.find(Question.class, id);
    }

    @Override
    @Transactional
    public List<Question> getByExamId(int examId) {
        Session session = entityManager.unwrap(Session.class);
        return session.createQuery("from Question q where q.exam.id = :eid", Question.class)
                .setParameter("eid", examId)
                .getResultList();
    }
}
