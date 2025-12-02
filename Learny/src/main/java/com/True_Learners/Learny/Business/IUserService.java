package com.True_Learners.Learny.Business;

import java.util.List;

import com.True_Learners.Learny.Entities.User;

public interface IUserService {
	List<User> getAll();
	void add(User user);
	void update(User user);
	void delete(User user);
	User getById(int id);
}
