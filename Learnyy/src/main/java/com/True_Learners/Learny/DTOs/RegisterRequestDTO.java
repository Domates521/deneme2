// src/main/java/com/True_Learners/Learny/DTOs/RegisterRequestDTO.java
package com.True_Learners.Learny.DTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Yeni kullanıcı kaydı için kullanılan DTO
 * 
 * VALİDASYON AÇIKLAMALARI:
 * - @NotBlank: Alan boş olamaz
 * - @Email: Geçerli email formatı olmalı
 * - @Size: Minimum/maximum karakter sayısı kontrolü
 * 
 * KULLANIM:
 * Frontend'den kayıt formu doldurulup gönderildiğinde bu DTO kullanılır
 * Validasyonlar otomatik çalışır, hatalı veri backend'e ulaşmaz
 */
public class RegisterRequestDTO {
    
    @NotBlank(message = "Kullanıcı adı boş bırakılamaz")
    @Size(min = 3, max = 50, message = "Kullanıcı adı 3-50 karakter arasında olmalı")
    private String userName;
    
    @NotBlank(message = "Şifre boş bırakılamaz")
    @Size(min = 6, message = "Şifre en az 6 karakter olmalı")
    private String password;
    
    @NotBlank(message = "Ad soyad boş bırakılamaz")
    @Size(max = 100, message = "Ad soyad en fazla 100 karakter olabilir")
    private String nameSurname;
    
    @NotBlank(message = "Email boş bırakılamaz")
    @Email(message = "Geçerli bir email adresi giriniz")
    private String mail;
    
    @NotBlank(message = "Rol seçilmelidir")
    private String role; // "Ogretmen" veya "Ogrenci"
    
    // Constructors
    public RegisterRequestDTO() {}
    
    public RegisterRequestDTO(String userName, String password, String nameSurname, 
                             String mail, String role) {
        this.userName = userName;
        this.password = password;
        this.nameSurname = nameSurname;
        this.mail = mail;
        this.role = role;
    }
    
    // Getters and Setters
    public String getUserName() {
        return userName;
    }
    
    public void setUserName(String userName) {
        this.userName = userName;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
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
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
}