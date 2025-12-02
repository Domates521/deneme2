// DataAccess/HibernateOgrenciDersKayitlariDal.java
package com.True_Learners.Learny.DataAccess;

import java.util.List;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.True_Learners.Learny.Entities.Enrollment;

import jakarta.persistence.EntityManager;

@Repository
public class HibernateOgrenciDersKayitlariDal implements IOgrenciDersKayitlariDal {

    private final EntityManager entityManager;

    @Autowired
    public HibernateOgrenciDersKayitlariDal(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    @Transactional
    public List<Enrollment> getAll() {
        Session session = entityManager.unwrap(Session.class);
        return session.createQuery("from Enrollment", Enrollment.class).getResultList();
    }

    @Override
    @Transactional
    public void add(Enrollment enrollment) {
        entityManager.persist(enrollment);
    }

    @Override
    @Transactional
    public void update(Enrollment enrollment) {
        entityManager.merge(enrollment);
    }

    @Override
    @Transactional
    public void delete(Enrollment enrollment) {
        Enrollment managed = entityManager.contains(enrollment) ? enrollment : entityManager.merge(enrollment);
        entityManager.remove(managed);
    }

    @Override
    @Transactional
    public Enrollment getById(int id) {
        return entityManager.find(Enrollment.class, id);
    }

    @Override
    @Transactional
    public List<Enrollment> getByStudentId(int studentId) {
        Session session = entityManager.unwrap(Session.class);
        return session.createQuery("from Enrollment e where e.student.id = :sid", Enrollment.class)
                .setParameter("sid", studentId)
                .getResultList();
    }

    @Override
    @Transactional
    public List<Enrollment> getByCourseId(int courseId) {
        Session session = entityManager.unwrap(Session.class);
        return session.createQuery("from Enrollment e where e.course.id = :cid", Enrollment.class)
                .setParameter("cid", courseId)
                .getResultList();
    }
}
