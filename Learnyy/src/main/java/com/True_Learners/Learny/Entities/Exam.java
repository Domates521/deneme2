// src/main/java/com/True_Learners/Learny/Entities/Exam.java
package com.True_Learners.Learny.Entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(name = "Sinavlar")
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Sinavid")
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Dersid", nullable = false)
    private Course course;

    @Column(name = "Baslik", nullable = false, length = 150)
    private String title;

    @Column(name = "Aciklama", columnDefinition = "TEXT")
    private String description;

    @Column(name = "Suredakika", nullable = false)
    private int durationMinutes;

    @Column(name = "Olusturmatarihi")
    private LocalDateTime createdAt;

    public Exam() {
    }

    public Exam(int id, Course course, String title, String description, int durationMinutes, LocalDateTime createdAt) {
        this.id = id;
        this.course = course;
        this.title = title;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.createdAt = createdAt;
    }

    // --- GETTER & SETTER ---

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(int durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
