// src/main/java/com/True_Learners/Learny/DTOs/UserDTO.java
package com.True_Learners.Learny.DTOs;

import com.True_Learners.Learny.Entities.User;

/**
 * Kullanıcı bilgilerini ŞİFRE OLMADAN taşıyan DTO
 * 
 * GÜVENLİK AÇIKLAMASI:
 * - passwordHash bilgisi BU DTO'DA YOKTUR
 * - User entity'den UserDTO'ya çevirirken şifre kesinlikle eklenmez
 * - Frontend'e asla şifre bilgisi gitmez
 * 
 * KULLANIM ALANLARI:
 * - Login sonrası kullanıcı bilgilerini dönerken
 * - Kullanıcı profili görüntülenirken
 * - Kullanıcı listesi gösterilirken
 */
public class UserDTO {
    
    private int id;
    private String userName;
    private String nameSurname;
    private String mail;
    private String role; // "Ogretmen" veya "Ogrenci"
    
    // Constructors
    public UserDTO() {}
    
    public UserDTO(int id, String userName, String nameSurname, String mail, String role) {
        this.id = id;
        this.userName = userName;
        this.nameSurname = nameSurname;
        this.mail = mail;
        this.role = role;
    }
    
    /**
     * User entity'den UserDTO oluşturan static factory method
     * ŞİFRE BİLGİSİNİ ALMAZ - GÜVENLİK
     */
    public static UserDTO fromUser(User user) {
        return new UserDTO(
            user.getId(),
            user.getUserName(),
            user.getNameSurname(),
            user.getMail(),
            user.getRole().toString()
        );
    }
    
    // Getters and Setters
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