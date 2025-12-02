// restAPI/CourseController.java
package com.True_Learners.Learny.restAPI;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.True_Learners.Learny.Business.ICourseService;
import com.True_Learners.Learny.Entities.Course;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:5173")
public class CourseController {

    private final ICourseService courseService;

    @Autowired
    public CourseController(ICourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public List<Course> getAll() {
        return courseService.getAll();
    }

    @GetMapping("/{id}")
    public Course getById(@PathVariable int id) {
        return courseService.getById(id);
    }

    @GetMapping("/teacher/{teacherId}")
    public List<Course> getByTeacher(@PathVariable int teacherId) {
        return courseService.getByTeacherId(teacherId);
    }

    @PostMapping("/add")
    public void add(@RequestBody Course course) {
        courseService.add(course);
    }

    @PostMapping("/update/{id}")
    public void update(@PathVariable int id, @RequestBody Course course) {
        course.setId(id);
        courseService.update(course);
    }

    @PostMapping("/delete/{id}")
    public void delete(@PathVariable int id) {
        Course c = courseService.getById(id);
        courseService.delete(c);
    }
}
