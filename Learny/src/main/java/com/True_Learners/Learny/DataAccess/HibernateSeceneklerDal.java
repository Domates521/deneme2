// DataAccess/HibernateSeceneklerDal.java
package com.True_Learners.Learny.DataAccess;

import java.util.List;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.True_Learners.Learny.Entities.Option;

import jakarta.persistence.EntityManager;

@Repository
public class HibernateSeceneklerDal implements ISeceneklerDal {

    private final EntityManager entityManager;

    @Autowired
    public HibernateSeceneklerDal(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    @Transactional
    public List<Option> getAll() {
        Session session = entityManager.unwrap(Session.class);
        return session.createQuery("from Option", Option.class).getResultList();
    }

    @Override
    @Transactional
    public void add(Option option) {
        entityManager.persist(option);
    }

    @Override
    @Transactional
    public void update(Option option) {
        entityManager.merge(option);
    }

    @Override
    @Transactional
    public void delete(Option option) {
    	Option managed = entityManager.contains(option) ? option : entityManager.merge(option);
        entityManager.remove(managed);
    }

    @Override
    @Transactional
    public Option getById(int id) {
        return entityManager.find(Option.class, id);
    }

    @Override
    @Transactional
    public List<Option> getByQuestionId(int questionId) {
        Session session = entityManager.unwrap(Session.class);
        return session.createQuery("from Option o where o.question.id = :qid", Option.class)
                .setParameter("qid", questionId)
                .getResultList();
    }
}
