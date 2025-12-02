// DataAccess/HibernateSinavlarDal.java
package com.True_Learners.Learny.DataAccess;

import java.util.List;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.True_Learners.Learny.Entities.Exam;

import jakarta.persistence.EntityManager;

@Repository
public class HibernateSinavlarDal implements ISinavlarDal {

    private final EntityManager entityManager;

    @Autowired
    public HibernateSinavlarDal(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    @Transactional
    public List<Exam> getAll() {
        Session session = entityManager.unwrap(Session.class);
        return session.createQuery("from Exam", Exam.class).getResultList();
    }

    @Override
    @Transactional
    public void add(Exam exam) {
        entityManager.persist(exam);
    }

    @Override
    @Transactional
    public void update(Exam exam) {
        entityManager.merge(exam);
    }

    @Override
    @Transactional
    public void delete(Exam exam) {
        Exam managed = entityManager.contains(exam) ? exam : entityManager.merge(exam);
        entityManager.remove(managed);
    }

    @Override
    @Transactional
    public Exam getById(int id) {
        return entityManager.find(Exam.class, id);
    }

    @Override
    @Transactional
    public List<Exam> getByCourseId(int courseId) {
        Session session = entityManager.unwrap(Session.class);
        return session.createQuery("from Exam e where e.course.id = :cid", Exam.class)
                .setParameter("cid", courseId)
                .getResultList();
    }
}
