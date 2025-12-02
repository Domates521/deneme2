package com.True_Learners.Learny.Business;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.True_Learners.Learny.DataAccess.IKullanicilarDal;
import com.True_Learners.Learny.Entities.User;

@Service
public class UserManager implements IUserService{
	
	private IKullanicilarDal userDal;
	
	@Autowired
	public UserManager(IKullanicilarDal userDal) {
		this.userDal = userDal;
	}

	@Override
	@Transactional
	public List<User> getAll() {
		// TODO Auto-generated method stub
		return userDal.getAll();
	}

	@Override
	@Transactional
	public void add(User user) {
		// TODO Auto-generated method stub
		this.userDal.add(user);
	}

	@Override
	@Transactional
	public void update(User user) {
		// TODO Auto-generated method stub
		this.userDal.update(user);
	}

	@Override
	@Transactional
	public void delete(User user) {
		// TODO Auto-generated method stub
		this.userDal.delete(user);
	}

	@Override
	@Transactional
	public User getById(int id) {
		// TODO Auto-generated method stub
		return this.userDal.getById(id);
	}
	
}
