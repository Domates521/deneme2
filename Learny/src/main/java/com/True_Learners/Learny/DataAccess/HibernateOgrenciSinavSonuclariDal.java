// DataAccess/HibernateOgrenciSinavSonuclariDal.java
package com.True_Learners.Learny.DataAccess;

import java.util.List;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.True_Learners.Learny.Entities.ExamResult;

import jakarta.persistence.EntityManager;

@Repository
public class HibernateOgrenciSinavSonuclariDal implements IOgrenciSinavSonuclariDal {

    private final EntityManager entityManager;

    @Autowired
    public HibernateOgrenciSinavSonuclariDal(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    @Transactional
    public List<ExamResult> getAll() {
        Session session = entityManager.unwrap(Session.class);
        return session.createQuery("from ExamResult", ExamResult.class).getResultList();
    }

    @Override
    @Transactional
    public void add(ExamResult result) {
        entityManager.persist(result);
    }

    @Override
    @Transactional
    public void update(ExamResult result) {
        entityManager.merge(result);
    }

    @Override
    @Transactional
    public void delete(ExamResult result) {
        ExamResult managed = entityManager.contains(result) ? result : entityManager.merge(result);
        entityManager.remove(managed);
    }

    @Override
    @Transactional
    public ExamResult getById(int id) {
        return entityManager.find(ExamResult.class, id);
    }

    @Override
    @Transactional
    public List<ExamResult> getByStudentId(int studentId) {
        Session session = entityManager.unwrap(Session.class);
        return session.createQuery("from ExamResult r where r.student.id = :sid", ExamResult.class)
                .setParameter("sid", studentId)
                .getResultList();
    }

    @Override
    @Transactional
    public List<ExamResult> getByExamId(int examId) {
        Session session = entityManager.unwrap(Session.class);
        return session.createQuery("from ExamResult r where r.exam.id = :eid", ExamResult.class)
                .setParameter("eid", examId)
                .getResultList();
    }
}
