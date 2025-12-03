// src/main/java/com/True_Learners/Learny/Entities/Enrollment.java
package com.True_Learners.Learny.Entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(
        name = "Ogrenciderskayitlari",
        uniqueConstraints = @UniqueConstraint(columnNames = {"OgrenciID", "DersID"})
)
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Kayitid")
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Ogrenciid", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Dersid", nullable = false)
    private Course course;

    public Enrollment() {
    }

    public Enrollment(int id, User student, Course course) {
        this.id = id;
        this.student = student;
        this.course = course;
    }

    // --- GETTER & SETTER ---

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }
}
