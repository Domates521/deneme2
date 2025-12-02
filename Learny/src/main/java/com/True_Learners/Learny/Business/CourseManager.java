// Business/CourseManager.java
package com.True_Learners.Learny.Business;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.True_Learners.Learny.DataAccess.IDerslerDal;
import com.True_Learners.Learny.Entities.Course;

@Service
public class CourseManager implements ICourseService {

    private final IDerslerDal derslerDal;

    @Autowired
    public CourseManager(IDerslerDal derslerDal) {
        this.derslerDal = derslerDal;
    }

    @Override
    @Transactional
    public List<Course> getAll() {
        return derslerDal.getAll();
    }

    @Override
    @Transactional
    public void add(Course course) {
        derslerDal.add(course);
    }

    @Override
    @Transactional
    public void update(Course course) {
        derslerDal.update(course);
    }

    @Override
    @Transactional
    public void delete(Course course) {
        derslerDal.delete(course);
    }

    @Override
    @Transactional
    public Course getById(int id) {
        return derslerDal.getById(id);
    }

    @Override
    @Transactional
    public List<Course> getByTeacherId(int teacherId) {
        return derslerDal.getByTeacherId(teacherId);
    }
}
