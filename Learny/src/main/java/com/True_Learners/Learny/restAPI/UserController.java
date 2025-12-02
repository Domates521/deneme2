package com.True_Learners.Learny.restAPI;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.True_Learners.Learny.Business.IUserService;
import com.True_Learners.Learny.Entities.User;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5137")
public class UserController {
	IUserService userService;
	
	@Autowired
	public UserController(IUserService userService) {
		this.userService = userService;
	}
	
	@GetMapping("/users")
	public List<User> get(){
		return userService.getAll();
	}
	
	@PostMapping("/users/add")
	public void add(@RequestBody User user){
		userService.add(user);
	}
	
	@PostMapping("/users/update")
	public void update(@RequestBody User user){
		userService.update(user);
	}
	
	@PostMapping("/users/delete")
	public void delete(@RequestBody User user){
		userService.delete(user);
	}
	
	@GetMapping("/users/{id}")
	public User getById(@PathVariable int id){
		return userService.getById(id);
	}
}
