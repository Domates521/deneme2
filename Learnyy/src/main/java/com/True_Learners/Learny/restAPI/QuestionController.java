// src/main/java/com/True_Learners/Learny/restAPI/QuestionController.java
package com.True_Learners.Learny.restAPI;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.True_Learners.Learny.Business.IQuestionService;
import com.True_Learners.Learny.Entities.Question;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:5173")
public class QuestionController {

    private final IQuestionService questionService;

    @Autowired
    public QuestionController(IQuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping
    public List<Question> getAll() {
        return questionService.getAll();
    }

    @GetMapping("/{id}")
    public Question getById(@PathVariable int id) {
        return questionService.getById(id);
    }

    @GetMapping("/exam/{examId}")
    public List<Question> getByExam(@PathVariable int examId) {
        return questionService.getByExamId(examId);
    }

    @PostMapping("/add")
    public void add(@RequestBody Question question) {
        questionService.add(question);
    }

    @PostMapping("/update/{id}")
    public void update(@PathVariable int id, @RequestBody Question question) {
        question.setId(id);
        questionService.update(question);
    }

    @PostMapping("/delete/{id}")
    public void delete(@PathVariable int id) {
        Question q = questionService.getById(id);
        questionService.delete(q);
    }
}
