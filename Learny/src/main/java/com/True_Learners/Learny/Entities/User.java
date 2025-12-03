package com.True_Learners.Learny.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name="kullanicilar")
public class User {
	
	@Id
	@Column(name="KullaniciID")
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	
	@Column(name="Kullaniciadi", nullable = false, unique = true, length = 50)
	private String userName;
	
	@Column(name="Sifrehash", nullable = false, length = 100)
	private String passwordHash;
	
	@Column(name="Adsoyad", nullable = false, length = 100)
	private String nameSurname;
	
	@Column(name="Eposta", nullable = false, unique = true, length = 100)
	private String mail;
	
	@Enumerated(EnumType.STRING)
	@Column(name="ROL", nullable = false)
	private Role role;
	
	public enum Role {
        Ogretmen, Ogrenci
    }
	
	
	public User(int id, String userName, String passwordHash, String nameSurname, String mail, Role role) {
		super();
		this.id = id;
		this.userName = userName;
		this.passwordHash = passwordHash;
		this.nameSurname = nameSurname;
		this.mail = mail;
		this.role = role;
	}
	
	public User() {}
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getPasswordHash() {
		return passwordHash;
	}
	public void setPasswordHash(String passwordHash) {
		this.passwordHash = passwordHash;
	}
	public String getNameSurname() {
		return nameSurname;
	}
	public void setNameSurname(String nameSurname) {
		this.nameSurname = nameSurname;
	}
	public String getMail() {
		return mail;
	}
	public void setMail(String mail) {
		this.mail = mail;
	}
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	}
	
}
