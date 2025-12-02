// src/main/java/com/True_Learners/Learny/Entities/Course.java
package com.True_Learners.Learny.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "Dersler")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Dersid")
    private int id;

    @Column(name = "Derskodu", nullable = false, unique = true, length = 10)
    private String code;

    @Column(name = "Dersadi", nullable = false, length = 120)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Dersogretmenid", nullable = false)
    private User teacher;   // Kullanicilar tablosundaki öğretmen

    public Course() {
    }

    public Course(int id, String code, String name, User teacher) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.teacher = teacher;
    }

    // --- GETTER & SETTER ---

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public User getTeacher() {
        return teacher;
    }

    public void setTeacher(User teacher) {
        this.teacher = teacher;
    }
}
