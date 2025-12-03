// src/main/java/com/True_Learners/Learny/Business/ICourseService.java
package com.True_Learners.Learny.Business;

import java.util.List;

import com.True_Learners.Learny.Entities.Course;

/**
 * COURSE SERVICE INTERFACE
 * 
 * Ders işlemleri için business logic tanımları
 */
public interface ICourseService {
    
    /**
     * Tüm dersleri getir
     */
    List<Course> getAll();
    
    /**
     * Yeni ders ekle
     */
    void add(Course course);
    
    /**
     * Ders güncelle
     */
    void update(Course course);
    
    /**
     * Ders sil
     */
    void delete(Course course);
    
    /**
     * ID'ye göre ders getir
     */
    Course getById(int id);
    
    /**
     * Öğretmene göre dersleri getir
     * 
     * @param teacherId Öğretmen ID
     * @return Öğretmenin verdiği tüm dersler
     */
    List<Course> getByTeacherId(int teacherId);
}
