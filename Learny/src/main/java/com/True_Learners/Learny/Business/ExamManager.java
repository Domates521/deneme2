// src/main/java/com/True_Learners/Learny/Business/ExamManager.java
package com.True_Learners.Learny.Business;

import com.True_Learners.Learny.DataAccess.IDerslerDal;
import com.True_Learners.Learny.DataAccess.IKullanicilarDal;
import com.True_Learners.Learny.DataAccess.IOgrenciSinavSonuclariDal;
import com.True_Learners.Learny.DataAccess.ISeceneklerDal;
import com.True_Learners.Learny.DataAccess.ISinavlarDal;
import com.True_Learners.Learny.DataAccess.ISorularDal;
import com.True_Learners.Learny.DTOs.ExamCreateDTO;
import com.True_Learners.Learny.DTOs.ExamFullDTO;
import com.True_Learners.Learny.DTOs.ExamResultDTO;
import com.True_Learners.Learny.DTOs.ExamSubmissionDTO;
import com.True_Learners.Learny.Entities.Course;
import com.True_Learners.Learny.Entities.Exam;
import com.True_Learners.Learny.Entities.ExamResult;
import com.True_Learners.Learny.Entities.Option;
import com.True_Learners.Learny.Entities.Question;
import com.True_Learners.Learny.Entities.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * EXAM MANAGER - DÜZELTİLMİŞ VERSİYON
 * 
 * Sınav işlemleri için business logic implementasyonu
 * Mevcut proje DTO yapısıyla uyumlu (nested DTO'lar)
 */
@Service
public class ExamManager implements IExamService {
    
    private final ISinavlarDal sinavlarDal;
    private final ISorularDal sorularDal;
    private final ISeceneklerDal seceneklerDal;
    private final IOgrenciSinavSonuclariDal sonuclarDal;
    private final IDerslerDal derslerDal;
    private final IKullanicilarDal kullanicilarDal;
    
    @Autowired
    public ExamManager(ISinavlarDal sinavlarDal, ISorularDal sorularDal,
                      ISeceneklerDal seceneklerDal, IOgrenciSinavSonuclariDal sonuclarDal,
                      IDerslerDal derslerDal, IKullanicilarDal kullanicilarDal) {
        this.sinavlarDal = sinavlarDal;
        this.sorularDal = sorularDal;
        this.seceneklerDal = seceneklerDal;
        this.sonuclarDal = sonuclarDal;
        this.derslerDal = derslerDal;
        this.kullanicilarDal = kullanicilarDal;
    }
    
    // ========== TEMEL CRUD İŞLEMLERİ ==========
    
    @Override
    @Transactional(readOnly = true)
    public List<Exam> getAll() {
        return sinavlarDal.getAll();
    }
    
    @Override
    @Transactional
    public void add(Exam exam) {
        sinavlarDal.add(exam);
    }
    
    @Override
    @Transactional
    public void update(Exam exam) {
        sinavlarDal.update(exam);
    }
    
    @Override
    @Transactional
    public void delete(Exam exam) {
        sinavlarDal.delete(exam);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Exam getById(int id) {
        return sinavlarDal.getById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<Exam> getByCourseId(int courseId) {
        return sinavlarDal.getByCourseId(courseId);
    }
    
    // ========== SINAV DETAYLARI (FULL) ==========
    
    /**
     * Sınav detaylarını sorular ve seçeneklerle birlikte getir
     * 
     * Bu metod öğrenci sınava başladığında çağrılır
     */
    @Override
    @Transactional(readOnly = true)
    public ExamFullDTO getExamWithFullDetails(int examId) {
        // 1. Sınavı getir
        Exam exam = sinavlarDal.getById(examId);
        if (exam == null) {
            throw new RuntimeException("Sınav bulunamadı: " + examId);
        }
        
        // 2. Soruları getir
        List<Question> questions = sorularDal.getByExamId(examId);
        
        // 3. DTO'ya dönüştür
        ExamFullDTO examFullDTO = new ExamFullDTO();
        examFullDTO.setExamId(exam.getId());
        examFullDTO.setTitle(exam.getTitle());
        examFullDTO.setDescription(exam.getDescription());
        examFullDTO.setDurationMinutes(exam.getDurationMinutes());
        examFullDTO.setCreatedAt(exam.getCreatedAt());
        examFullDTO.setCourseId(exam.getCourse().getId());
        examFullDTO.setCourseName(exam.getCourse().getName());
        
        // 4. Her soru için seçenekleri getir ve DTO'ya ekle
        List<ExamFullDTO.QuestionDTO> questionDTOs = new ArrayList<>();
        for (Question question : questions) {
            // Seçenekleri getir
            List<Option> options = seceneklerDal.getByQuestionId(question.getId());
            List<ExamFullDTO.OptionDTO> optionDTOs = new ArrayList<>();
            
            for (Option option : options) {
                // GÜVENLİK: Öğrenciye doğru cevabı gösterme!
                ExamFullDTO.OptionDTO optionDTO = new ExamFullDTO.OptionDTO(
                    option.getId(),
                    option.getText()
                );
                optionDTOs.add(optionDTO);
            }
            
            // QuestionDTO oluştur
            ExamFullDTO.QuestionDTO questionDTO = new ExamFullDTO.QuestionDTO(
                question.getId(),
                question.getText(),
                question.getType().name(),
                optionDTOs
            );
            
            questionDTOs.add(questionDTO);
        }
        
        examFullDTO.setQuestions(questionDTOs);
        return examFullDTO;
    }
    
    // ========== SINAV PUANLAMA ==========
    
    /**
     * Sınavı puanla ve sonucu kaydet
     * 
     * AKIŞ:
     * 1. Öğrencinin cevaplarını al
     * 2. Doğru cevaplarla karşılaştır
     * 3. Puanı hesapla
     * 4. Sonucu veritabanına kaydet
     * 5. Detaylı sonuç döndür
     */
    @Override
    @Transactional
    public ExamResultDTO submitExamAndCalculateScore(ExamSubmissionDTO submission) {
        // 1. Sınavı ve öğrenciyi kontrol et
        Exam exam = sinavlarDal.getById(submission.getExamId());
        if (exam == null) {
            throw new RuntimeException("Sınav bulunamadı: " + submission.getExamId());
        }
        
        User student = kullanicilarDal.getById(submission.getStudentId());
        if (student == null) {
            throw new RuntimeException("Öğrenci bulunamadı: " + submission.getStudentId());
        }
        
        // 2. Soruları getir
        List<Question> questions = sorularDal.getByExamId(submission.getExamId());
        if (questions.isEmpty()) {
            throw new RuntimeException("Sınavda soru bulunamadı!");
        }
        
        // 3. Puanlamayı yap
        int totalQuestions = questions.size();
        int correctAnswers = 0;
        
        for (Question question : questions) {
            // Öğrencinin bu soru için verdiği cevabı bul
            ExamSubmissionDTO.AnswerDTO studentAnswer = submission.getAnswers().stream()
                .filter(answer -> answer.getQuestionId() == question.getId())
                .findFirst()
                .orElse(null);
            
            if (studentAnswer == null || studentAnswer.getSelectedOptionIds().isEmpty()) {
                continue; // Öğrenci bu soruyu cevaplamadı
            }
            
            // Doğru cevabı/cevapları bul
            List<Option> options = seceneklerDal.getByQuestionId(question.getId());
            List<Integer> correctOptionIds = new ArrayList<>();
            
            for (Option option : options) {
                if (option.isCorrect()) {
                    correctOptionIds.add(option.getId());
                }
            }
            
            // Öğrencinin cevabı doğru mu kontrol et
            if (correctOptionIds.size() == studentAnswer.getSelectedOptionIds().size() &&
                correctOptionIds.containsAll(studentAnswer.getSelectedOptionIds())) {
                correctAnswers++;
            }
        }
        
        // 4. Puanı hesapla (100 üzerinden)
        BigDecimal score = BigDecimal.valueOf(correctAnswers)
            .divide(BigDecimal.valueOf(totalQuestions), 2, RoundingMode.HALF_UP)
            .multiply(BigDecimal.valueOf(100));
        
        // 5. Sonucu kaydet
        ExamResult result = new ExamResult();
        result.setExam(exam);
        result.setStudent(student);
        result.setScore(score);
        result.setFinishedAt(LocalDateTime.now());
        
        sonuclarDal.add(result);
        
        // 6. DTO döndür
        ExamResultDTO resultDTO = new ExamResultDTO();
        resultDTO.setResultId(result.getId());
        resultDTO.setExamId(exam.getId());
        resultDTO.setExamTitle(exam.getTitle());
        resultDTO.setStudentId(student.getId());
        resultDTO.setStudentName(student.getNameSurname());
        resultDTO.setScore(score);
        resultDTO.setTotalQuestions(totalQuestions);
        resultDTO.setCorrectAnswers(correctAnswers);
        resultDTO.setWrongAnswers(totalQuestions - correctAnswers);
        resultDTO.setFinishedAt(result.getFinishedAt());
        
        return resultDTO;
    }
    
    // ========== SINAV OLUŞTURMA (SORULAR DAHİL) ==========
    
    /**
     * Yeni sınav oluştur (sorular ve seçenekler dahil)
     * 
     * Bu metod öğretmen sınav oluştururken çağrılır
     * 
     * TRANSACTION: Tüm işlem tek transaction içinde yapılır
     * Herhangi bir hata olursa tüm işlem geri alınır
     */
    @Override
    @Transactional
    public int createExamWithQuestions(ExamCreateDTO dto) {
        // 1. Validasyon
        if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Sınav başlığı boş olamaz!");
        }
        
        if (dto.getDurationMinutes() == null || dto.getDurationMinutes() <= 0) {
            throw new IllegalArgumentException("Sınav süresi pozitif olmalıdır!");
        }
        
        if (dto.getQuestions() == null || dto.getQuestions().isEmpty()) {
            throw new IllegalArgumentException("Sınav en az 1 soru içermelidir!");
        }
        
        // 2. Dersi kontrol et
        Course course = derslerDal.getById(dto.getCourseId());
        if (course == null) {
            throw new RuntimeException("Ders bulunamadı: " + dto.getCourseId());
        }
        
        // 3. Sınavı oluştur
        Exam exam = new Exam();
        exam.setCourse(course);
        exam.setTitle(dto.getTitle().trim());
        exam.setDescription(dto.getDescription());
        exam.setDurationMinutes(dto.getDurationMinutes());
        exam.setCreatedAt(LocalDateTime.now());
        
        // 4. Sınavı kaydet
        sinavlarDal.add(exam);
        
        // 5. Soruları ve seçenekleri oluştur
        for (ExamCreateDTO.QuestionCreateDTO questionDTO : dto.getQuestions()) {
            // Soru validasyonu
            if (questionDTO.getText() == null || questionDTO.getText().trim().isEmpty()) {
                throw new IllegalArgumentException("Soru metni boş olamaz!");
            }
            
            if (questionDTO.getType() == null || questionDTO.getType().trim().isEmpty()) {
                throw new IllegalArgumentException("Soru tipi belirtilmelidir!");
            }
            
            // Soruyu oluştur
            Question question = new Question();
            question.setExam(exam);
            question.setText(questionDTO.getText().trim());
            
            // Soru tipini kontrol et ve ayarla
            try {
                question.setType(Question.QuestionType.valueOf(questionDTO.getType()));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException(
                    "Geçersiz soru tipi: " + questionDTO.getType() + 
                    ". Geçerli tipler: CoktanSecmeli, DogruYanlis"
                );
            }
            
            // Soruyu kaydet
            sorularDal.add(question);
            
            // Seçenekleri kontrol et
            if (questionDTO.getOptions() == null || questionDTO.getOptions().isEmpty()) {
                throw new IllegalArgumentException("Her soru en az 1 seçenek içermelidir!");
            }
            
            // En az bir doğru cevap var mı kontrol et
            boolean hasCorrectAnswer = questionDTO.getOptions().stream()
                .anyMatch(ExamCreateDTO.OptionCreateDTO::getIsCorrect);
            
            if (!hasCorrectAnswer) {
                throw new IllegalArgumentException(
                    "Soru '" + questionDTO.getText() + "' için en az 1 doğru cevap belirtilmelidir!"
                );
            }
            
            // Seçenekleri oluştur
            for (ExamCreateDTO.OptionCreateDTO optionDTO : questionDTO.getOptions()) {
                if (optionDTO.getText() == null || optionDTO.getText().trim().isEmpty()) {
                    throw new IllegalArgumentException("Seçenek metni boş olamaz!");
                }
                
                Option option = new Option();
                option.setQuestion(question);
                option.setText(optionDTO.getText().trim());
                option.setCorrect(optionDTO.getIsCorrect() != null ? optionDTO.getIsCorrect() : false);
                
                // Seçeneği kaydet
                seceneklerDal.add(option);
            }
        }
        
        return exam.getId();
    }
}