// src/main/java/com/True_Learners/Learny/DataAccess/HibernateDerslerDal.java
package com.True_Learners.Learny.DataAccess;

import java.util.List;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.True_Learners.Learny.Entities.Course;

import jakarta.persistence.EntityManager;

/**
 * HIBERNATE DERSLER DAL
 * 
 * Ders veritabanı işlemleri için Hibernate implementasyonu
 */
@Repository
public class HibernateDerslerDal implements IDerslerDal {

    private final EntityManager entityManager;

    @Autowired
    public HibernateDerslerDal(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    @Transactional
    public List<Course> getAll() {
        Session session = entityManager.unwrap(Session.class);
        return session.createQuery("from Course", Course.class).getResultList();
    }

    @Override
    @Transactional
    public void add(Course course) {
        entityManager.persist(course);
    }

    @Override
    @Transactional
    public void update(Course course) {
        entityManager.merge(course);
    }

    @Override
    @Transactional
    public void delete(Course course) {
        Course managed = entityManager.contains(course) ? course : entityManager.merge(course);
        entityManager.remove(managed);
    }

    @Override
    @Transactional
    public Course getById(int id) {
        return entityManager.find(Course.class, id);
    }

    @Override
    @Transactional
    public List<Course> getByTeacherId(int teacherId) {
        Session session = entityManager.unwrap(Session.class);
        return session.createQuery("from Course c where c.teacher.id = :tid", Course.class)
                .setParameter("tid", teacherId)
                .getResultList();
    }
}
