// Business/ExamManager.java
package com.True_Learners.Learny.Business;

import com.True_Learners.Learny.DataAccess.*;
import com.True_Learners.Learny.DTOs.*;
import com.True_Learners.Learny.Entities.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * EXAM MANAGER
 * 
 * Sınav işlemlerinin business logic implementasyonu
 * 
 * KATMAN MİMARİSİ:
 * Controller -> ExamManager (Business) -> Dal (Data Access) -> Database
 * 
 * DEPENDENCY INJECTION:
 * - ISinavlarDal: Sınav veritabanı işlemleri
 * - ISorularDal: Soru veritabanı işlemleri
 * - ISeceneklerDal: Seçenek veritabanı işlemleri
 * - IOgrenciSinavSonuclariDal: Sonuç veritabanı işlemleri
 * - IDerslerDal: Ders veritabanı işlemleri
 * - IKullanicilarDal: Kullanıcı veritabanı işlemleri
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
    @Transactional
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
    @Transactional
    public Exam getById(int id) {
        return sinavlarDal.getById(id);
    }
    
    @Override
    @Transactional
    public List<Exam> getByCourseId(int courseId) {
        return sinavlarDal.getByCourseId(courseId);
    }
    
    // ========== SINAV DETAYLARI (FULL) ==========
    
    /**
     * Sınav detaylarını sorular ve seçeneklerle birlikte getir
     * 
     * AKIŞ:
     * 1. Sınav bilgilerini al
     * 2. Sınavın tüm sorularını al
     * 3. Her sorunun seçeneklerini al
     * 4. DTO'ya dönüştür (GÜVENLİK: Doğru cevap bilgisi GÖNDERİLMEZ)
     * 5. Frontend'e döndür
     */
    @Override
    @Transactional
    public ExamFullDTO getExamWithFullDetails(int examId) {
        // 1. Sınav bilgilerini al
        Exam exam = sinavlarDal.getById(examId);
        if (exam == null) {
            throw new RuntimeException("Sınav bulunamadı: ID = " + examId);
        }
        
        // 2. Sınavın tüm sorularını al
        List<Question> questions = sorularDal.getByExamId(examId);
        
        // 3. Her soru için seçenekleri al ve DTO'ya dönüştür
        List<ExamFullDTO.QuestionDTO> questionDTOs = new ArrayList<>();
        
        for (Question question : questions) {
            // Sorunun seçeneklerini al
            List<Option> options = seceneklerDal.getByQuestionId(question.getId());
            
            // Seçenekleri DTO'ya dönüştür (DOĞRU BİLGİSİ GÖNDERİLMEZ!)
            List<ExamFullDTO.OptionDTO> optionDTOs = options.stream()
                .map(option -> new ExamFullDTO.OptionDTO(
                    option.getId(),
                    option.getText()
                    // isCorrect bilgisi BURADA YOK!
                ))
                .collect(Collectors.toList());
            
            // Soru DTO'su oluştur
            ExamFullDTO.QuestionDTO questionDTO = new ExamFullDTO.QuestionDTO(
                question.getId(),
                question.getText(),
                question.getType().toString(),
                optionDTOs
            );
            
            questionDTOs.add(questionDTO);
        }
        
        // 4. Sınav DTO'su oluştur
        ExamFullDTO examFullDTO = new ExamFullDTO(
            exam.getId(),
            exam.getTitle(),
            exam.getDescription(),
            exam.getDurationMinutes(),
            exam.getCreatedAt(),
            exam.getCourse().getId(),
            exam.getCourse().getName(),
            questionDTOs
        );
        
        return examFullDTO;
    }
    
    // ========== SINAV PUANLAMA VE KAYDETME ==========
    
    /**
     * Sınavı puanla ve sonucu kaydet
     * 
     * AKIŞ:
     * 1. Sınav ve soruları al
     * 2. Her sorunun doğru cevabını bul
     * 3. Öğrencinin cevaplarıyla karşılaştır
     * 4. Puanı hesapla (doğru sayısı / toplam soru * 100)
     * 5. Sonucu veritabanına kaydet
     * 6. Detaylı sonuç DTO'sunu döndür
     */
    @Override
    @Transactional
    public ExamResultDTO submitExamAndCalculateScore(ExamSubmissionDTO submission) {
        // 1. Sınav ve öğrenci bilgilerini al
        Exam exam = sinavlarDal.getById(submission.getExamId());
        User student = kullanicilarDal.getById(submission.getStudentId());
        
        if (exam == null) {
            throw new RuntimeException("Sınav bulunamadı");
        }
        if (student == null) {
            throw new RuntimeException("Öğrenci bulunamadı");
        }
        
        // 2. Sınavın tüm sorularını al
        List<Question> questions = sorularDal.getByExamId(submission.getExamId());
        
        // 3. Her soru için puanlama yap
        int totalQuestions = questions.size();
        int correctAnswers = 0;
        int wrongAnswers = 0;
        int emptyAnswers = 0;
        
        List<ExamResultDTO.QuestionResultDTO> questionResults = new ArrayList<>();
        
        for (Question question : questions) {
            // Sorunun doğru cevap(lar)ını bul
            List<Option> allOptions = seceneklerDal.getByQuestionId(question.getId());
            List<Integer> correctOptionIds = allOptions.stream()
                .filter(Option::isCorrect)
                .map(Option::getId)
                .collect(Collectors.toList());
            
            // Öğrencinin bu soruya verdiği cevabı bul
            ExamSubmissionDTO.AnswerDTO studentAnswer = submission.getAnswers().stream()
                .filter(answer -> answer.getQuestionId() == question.getId())
                .findFirst()
                .orElse(null);
            
            boolean isCorrect = false;
            String studentAnswerText = "Boş";
            
            if (studentAnswer != null && !studentAnswer.getSelectedOptionIds().isEmpty()) {
                List<Integer> studentOptionIds = studentAnswer.getSelectedOptionIds();
                
                // Cevap kontrolü: Öğrencinin seçtikleri = Doğru cevaplar
                isCorrect = correctOptionIds.size() == studentOptionIds.size() &&
                           correctOptionIds.containsAll(studentOptionIds);
                
                // Öğrencinin cevap metnini al
                studentAnswerText = allOptions.stream()
                    .filter(opt -> studentOptionIds.contains(opt.getId()))
                    .map(Option::getText)
                    .collect(Collectors.joining(", "));
            } else {
                emptyAnswers++;
            }
            
            if (isCorrect) {
                correctAnswers++;
            } else if (studentAnswer != null && !studentAnswer.getSelectedOptionIds().isEmpty()) {
                wrongAnswers++;
            }
            
            // Doğru cevap metnini al
            String correctAnswerText = allOptions.stream()
                .filter(Option::isCorrect)
                .map(Option::getText)
                .collect(Collectors.joining(", "));
            
            // Soru sonucu DTO'su oluştur
            ExamResultDTO.QuestionResultDTO questionResult = new ExamResultDTO.QuestionResultDTO(
                question.getId(),
                question.getText(),
                isCorrect,
                studentAnswerText,
                correctAnswerText
            );
            
            questionResults.add(questionResult);
        }
        
        // 4. Puanı hesapla (0-100 arası)
        BigDecimal score = BigDecimal.ZERO;
        if (totalQuestions > 0) {
            score = BigDecimal.valueOf(correctAnswers)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(totalQuestions), 2, RoundingMode.HALF_UP);
        }
        
        // 5. Sonucu veritabanına kaydet
        ExamResult examResult = new ExamResult();
        examResult.setExam(exam);
        examResult.setStudent(student);
        examResult.setScore(score);
        examResult.setFinishedAt(LocalDateTime.now());
        
        sonuclarDal.add(examResult);
        
        // 6. Sonuç DTO'sunu oluştur ve döndür
        ExamResultDTO resultDTO = new ExamResultDTO(
            examResult.getId(),
            exam.getId(),
            exam.getTitle(),
            student.getId(),
            student.getNameSurname(),
            score,
            totalQuestions,
            correctAnswers,
            wrongAnswers,
            emptyAnswers,
            examResult.getFinishedAt(),
            questionResults
        );
        
        return resultDTO;
    }
    
    // ========== YENİ SINAV OLUŞTURMA ==========
    
    /**
     * Yeni sınav oluştur (sorular ve seçenekler dahil)
     * 
     * AKIŞ:
     * 1. Sınav entity'si oluştur ve kaydet
     * 2. Her soru için:
     *    - Soru entity'si oluştur ve kaydet
     *    - Her seçenek için:
     *      - Seçenek entity'si oluştur ve kaydet
     * 3. Oluşturulan sınav ID'sini döndür
     */
    @Override
    @Transactional
    public int createExamWithQuestions(ExamCreateDTO examCreateDTO) {
        // 1. Dersi al
        Course course = derslerDal.getById(examCreateDTO.getCourseId());
        if (course == null) {
            throw new RuntimeException("Ders bulunamadı");
        }
        
        // 2. Sınav entity'si oluştur
        Exam exam = new Exam();
        exam.setCourse(course);
        exam.setTitle(examCreateDTO.getTitle());
        exam.setDescription(examCreateDTO.getDescription());
        exam.setDurationMinutes(examCreateDTO.getDurationMinutes());
        exam.setCreatedAt(LocalDateTime.now());
        
        // Sınavı kaydet
        sinavlarDal.add(exam);
        
        // 3. Soruları ve seçenekleri ekle
        for (ExamCreateDTO.QuestionCreateDTO questionDTO : examCreateDTO.getQuestions()) {
            // Soru entity'si oluştur
            Question question = new Question();
            question.setExam(exam);
            question.setText(questionDTO.getText());
            
            // Soru tipini enum'a dönüştür
            try {
                question.setType(Question.QuestionType.valueOf(questionDTO.getType()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Geçersiz soru tipi: " + questionDTO.getType());
            }
            
            // Soruyu kaydet
            sorularDal.add(question);
            
            // 4. Seçenekleri ekle
            for (ExamCreateDTO.OptionCreateDTO optionDTO : questionDTO.getOptions()) {
                Option option = new Option();
                option.setQuestion(question);
                option.setText(optionDTO.getText());
                option.setCorrect(optionDTO.getIsCorrect());
                
                // Seçeneği kaydet
                seceneklerDal.add(option);
            }
        }
        
        return exam.getId();
    }
}