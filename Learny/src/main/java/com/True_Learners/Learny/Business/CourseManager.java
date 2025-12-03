// src/main/java/com/True_Learners/Learny/Business/CourseManager.java
package com.True_Learners.Learny.Business;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.True_Learners.Learny.DataAccess.IDerslerDal;
import com.True_Learners.Learny.Entities.Course;

/**
 * COURSE MANAGER
 * 
 * Ders işlemleri için business logic implementasyonu
 */
@Service
public class CourseManager implements ICourseService {
    
    private final IDerslerDal courseDal;
    
    @Autowired
    public CourseManager(IDerslerDal courseDal) {
        this.courseDal = courseDal;
    }
    
    @Override
    @Transactional
    public List<Course> getAll() {
        return courseDal.getAll();
    }
    
    @Override
    @Transactional
    public void add(Course course) {
        courseDal.add(course);
    }
    
    @Override
    @Transactional
    public void update(Course course) {
        courseDal.update(course);
    }
    
    @Override
    @Transactional
    public void delete(Course course) {
        courseDal.delete(course);
    }
    
    @Override
    @Transactional
    public Course getById(int id) {
        return courseDal.getById(id);
    }
    
    @Override
    @Transactional
    public List<Course> getByTeacherId(int teacherId) {
        return courseDal.getByTeacherId(teacherId);
    }
}
