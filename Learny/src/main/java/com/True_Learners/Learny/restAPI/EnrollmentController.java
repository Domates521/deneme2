// src/main/java/com/True_Learners/Learny/restAPI/EnrollmentController.java
package com.True_Learners.Learny.restAPI;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.True_Learners.Learny.Business.IEnrollmentService;
import com.True_Learners.Learny.Entities.Enrollment;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "http://localhost:5173")
public class EnrollmentController {

    private final IEnrollmentService enrollmentService;

    @Autowired
    public EnrollmentController(IEnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @GetMapping
    public List<Enrollment> getAll() {
        return enrollmentService.getAll();
    }

    @GetMapping("/{id}")
    public Enrollment getById(@PathVariable int id) {
        return enrollmentService.getById(id);
    }

    @GetMapping("/student/{studentId}")
    public List<Enrollment> getByStudent(@PathVariable int studentId) {
        return enrollmentService.getByStudentId(studentId);
    }

    @GetMapping("/course/{courseId}")
    public List<Enrollment> getByCourse(@PathVariable int courseId) {
        return enrollmentService.getByCourseId(courseId);
    }

    @PostMapping("/add")
    public void add(@RequestBody Enrollment enrollment) {
        enrollmentService.add(enrollment);
    }

    @PostMapping("/update/{id}")
    public void update(@PathVariable int id, @RequestBody Enrollment enrollment) {
        enrollment.setId(id);
        enrollmentService.update(enrollment);
    }

    @PostMapping("/delete/{id}")
    public void delete(@PathVariable int id) {
        Enrollment e = enrollmentService.getById(id);
        enrollmentService.delete(e);
    }
}
