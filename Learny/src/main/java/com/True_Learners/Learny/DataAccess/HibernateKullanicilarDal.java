package com.True_Learners.Learny.DataAccess;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.True_Learners.Learny.Entities.User;

import jakarta.persistence.EntityManager;
import org.hibernate.Session;

// Standard JPA - ORM
@Repository
public class HibernateKullanicilarDal implements IKullanicilarDal{
	
	private EntityManager entityManager;
	
	// Constructor Injection
	@Autowired
	public HibernateKullanicilarDal(EntityManager entityManager) {
		super();
		this.entityManager = entityManager;
	}
	
	// AOP - Aspect Oriented Programming
	@Override
	@Transactional
	public List<User> getAll() {
		Session session = entityManager.unwrap(Session.class);
		List<User> users = session.createQuery("from User", User.class).getResultList();
		return users;
	}

	@Override
	@Transactional
	public void add(User user) {
		// TODO Auto-generated method stub
		entityManager.persist(user);
		
	}

	@Override
	@Transactional
	public void update(User user) {
		// TODO Auto-generated method stub
		entityManager.merge(user);
	}

	@Override
	@Transactional
	public void delete(User user) {
		// TODO Auto-generated method stub
		User managed = entityManager.contains(user) ? user : entityManager.merge(user);
        entityManager.remove(managed);
	}

	@Override
	@Transactional
	public User getById(int id) {
		// TODO Auto-generated method stub
		return entityManager.find(User.class, id);
	}


}
