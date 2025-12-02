// restAPI/ExamResultController.java
package com.True_Learners.Learny.restAPI;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.True_Learners.Learny.Business.IExamResultService;
import com.True_Learners.Learny.Entities.ExamResult;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "http://localhost:5173")
public class ExamResultController {

    private final IExamResultService resultService;

    @Autowired
    public ExamResultController(IExamResultService resultService) {
        this.resultService = resultService;
    }

    @GetMapping
    public List<ExamResult> getAll() {
        return resultService.getAll();
    }

    @GetMapping("/{id}")
    public ExamResult getById(@PathVariable int id) {
        return resultService.getById(id);
    }

    @GetMapping("/student/{studentId}")
    public List<ExamResult> getByStudent(@PathVariable int studentId) {
        return resultService.getByStudentId(studentId);
    }

    @GetMapping("/exam/{examId}")
    public List<ExamResult> getByExam(@PathVariable int examId) {
        return resultService.getByExamId(examId);
    }

    @PostMapping("/add")
    public void add(@RequestBody ExamResult result) {
        resultService.add(result);
    }

    @PostMapping("/update/{id}")
    public void update(@PathVariable int id, @RequestBody ExamResult result) {
    	result.setId(id);
        resultService.update(result);
    }

    @PostMapping("/delete/{id}")
    public void delete(@PathVariable int id) {
        ExamResult r = resultService.getById(id);
        resultService.delete(r);
    }
}
