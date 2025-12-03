// src/main/java/com/True_Learners/Learny/DataAccess/IDerslerDal.java
package com.True_Learners.Learny.DataAccess;

import java.util.List;

import com.True_Learners.Learny.Entities.Course;

/**
 * DERSLER DATA ACCESS INTERFACE
 * 
 * Ders veritabanı işlemleri için tanımlar
 */
public interface IDerslerDal {
    
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
