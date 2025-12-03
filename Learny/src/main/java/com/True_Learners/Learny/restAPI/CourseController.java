// src/main/java/com/True_Learners/Learny/restAPI/CourseController.java
package com.True_Learners.Learny.restAPI;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.True_Learners.Learny.Business.ICourseService;
import com.True_Learners.Learny.Entities.Course;

/**
 * COURSE CONTROLLER
 * 
 * Ders işlemleri için REST API endpoint'leri
 * 
 * ENDPOINT'LER:
 * - GET /api/courses               - Tüm dersleri getir
 * - GET /api/courses/{id}          - ID'ye göre ders getir
 * - GET /api/courses/teacher/{id}  - Öğretmene göre dersleri getir
 * - POST /api/courses/add          - Yeni ders ekle
 * - POST /api/courses/update/{id}  - Ders güncelle
 * - POST /api/courses/delete/{id}  - Ders sil
 */
@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173")
public class CourseController {

    private final ICourseService courseService;

    @Autowired
    public CourseController(ICourseService courseService) {
        this.courseService = courseService;
    }

    /**
     * Tüm dersleri getir
     */
    @GetMapping
    public ResponseEntity<List<Course>> getAll() {
        List<Course> courses = courseService.getAll();
        return ResponseEntity.ok(courses);
    }

    /**
     * ID'ye göre ders getir
     */
    @GetMapping("/{id}")
    public ResponseEntity<Course> getById(@PathVariable int id) {
        Course course = courseService.getById(id);
        if (course == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(course);
    }

    /**
     * Öğretmene göre dersleri getir
     * 
     * ENDPOINT: GET /api/courses/teacher/{teacherId}
     * 
     * KULLANIM: Öğretmenin verdiği tüm dersleri listele
     * (Sınav oluşturma sayfasında ders seçimi için)
     */
    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<Course>> getByTeacher(@PathVariable int teacherId) {
        List<Course> courses = courseService.getByTeacherId(teacherId);
        return ResponseEntity.ok(courses);
    }

    /**
     * Yeni ders ekle
     */
    @PostMapping("/add")
    public ResponseEntity<String> add(@RequestBody Course course) {
        courseService.add(course);
        return ResponseEntity.ok("Ders başarıyla eklendi");
    }

    /**
     * Ders güncelle
     */
    @PostMapping("/update/{id}")
    public ResponseEntity<String> update(@PathVariable int id, @RequestBody Course course) {
        course.setId(id);
        courseService.update(course);
        return ResponseEntity.ok("Ders başarıyla güncellendi");
    }

    /**
     * Ders sil
     */
    @PostMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable int id) {
        Course course = courseService.getById(id);
        if (course == null) {
            return ResponseEntity.notFound().build();
        }
        courseService.delete(course);
        return ResponseEntity.ok("Ders başarıyla silindi");
    }
}
