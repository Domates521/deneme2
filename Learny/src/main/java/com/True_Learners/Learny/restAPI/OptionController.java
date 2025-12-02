// src/main/java/com/True_Learners/Learny/restAPI/OptionChoiceController.java
package com.True_Learners.Learny.restAPI;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.True_Learners.Learny.Business.IOptionService;
import com.True_Learners.Learny.Entities.Option;

@RestController
@RequestMapping("/api/options")
@CrossOrigin(origins = "http://localhost:5173")
public class OptionController {

    private final IOptionService optionService;

    @Autowired
    public OptionController(IOptionService optionService) {
        this.optionService = optionService;
    }

    @GetMapping
    public List<Option> getAll() {
        return optionService.getAll();
    }

    @GetMapping("/{id}")
    public Option getById(@PathVariable int id) {
        return optionService.getById(id);
    }

    @GetMapping("/question/{questionId}")
    public List<Option> getByQuestion(@PathVariable int questionId) {
        return optionService.getByQuestionId(questionId);
    }

    @PostMapping("/add")
    public void add(@RequestBody Option option) {
        optionService.add(option);
    }

    @PostMapping("/update/{id}")
    public void update(@PathVariable int id, @RequestBody Option option) {
        option.setId(id);
        optionService.update(option);
    }

    @PostMapping("/delete/{id}")
    public void delete(@PathVariable int id) {
    	Option o = optionService.getById(id);
        optionService.delete(o);
    }
}
