// src/main/java/com/True_Learners/Learny/Entities/ExamResult.java
package com.True_Learners.Learny.Entities;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Entity
@Table(
        name = "Ogrencisinavsonuclari",
        uniqueConstraints = @UniqueConstraint(columnNames = {"OgrenciID", "SinavID"})
)
public class ExamResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Sonucid")
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Sinavid", nullable = false)
    private Exam exam;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "Ogrenciid", nullable = false)
    private User student;

    @Column(name = "Puan", nullable = false, precision = 5, scale = 2)
    private BigDecimal score;

    @Column(name = "Bitiszamani")
    private LocalDateTime finishedAt;

    public ExamResult() {
    }

    public ExamResult(int id, Exam exam, User student, BigDecimal score, LocalDateTime finishedAt) {
        this.id = id;
        this.exam = exam;
        this.student = student;
        this.score = score;
        this.finishedAt = finishedAt;
    }

    // --- GETTER & SETTER ---

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Exam getExam() {
        return exam;
    }

    public void setExam(Exam exam) {
        this.exam = exam;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public BigDecimal getScore() {
        return score;
    }

    public void setScore(BigDecimal score) {
        this.score = score;
    }

    public LocalDateTime getFinishedAt() {
        return finishedAt;
    }

    public void setFinishedAt(LocalDateTime finishedAt) {
        this.finishedAt = finishedAt;
    }
}
