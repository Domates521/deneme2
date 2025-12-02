// src/main/java/com/True_Learners/Learny/Business/EnrollmentManager.java
package com.True_Learners.Learny.Business;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.True_Learners.Learny.DataAccess.IOgrenciDersKayitlariDal;
import com.True_Learners.Learny.Entities.Enrollment;

@Service
public class EnrollmentManager implements IEnrollmentService {

    private final IOgrenciDersKayitlariDal enrollmentDal;

    @Autowired
    public EnrollmentManager(IOgrenciDersKayitlariDal enrollmentDal) {
        this.enrollmentDal = enrollmentDal;
    }

    @Override
    @Transactional
    public List<Enrollment> getAll() {
        return enrollmentDal.getAll();
    }

    @Override
    @Transactional
    public void add(Enrollment enrollment) {
        enrollmentDal.add(enrollment);
    }

    @Override
    @Transactional
    public void update(Enrollment enrollment) {
        enrollmentDal.update(enrollment);
    }

    @Override
    @Transactional
    public void delete(Enrollment enrollment) {
        enrollmentDal.delete(enrollment);
    }

    @Override
    @Transactional
    public Enrollment getById(int id) {
        return enrollmentDal.getById(id);
    }

    @Override
    @Transactional
    public List<Enrollment> getByStudentId(int studentId) {
        return enrollmentDal.getByStudentId(studentId);
    }

    @Override
    @Transactional
    public List<Enrollment> getByCourseId(int courseId) {
        return enrollmentDal.getByCourseId(courseId);
    }
}
