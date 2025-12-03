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
import java.util.stream.Collectors;

/**
 * EXAM MANAGER - DÜZELTİLMİŞ VERSİYON
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
    
    @Override
    @Transactional
    public ExamFullDTO getExamWithFullDetails(int examId) {
        Exam exam = sinavlarDal.getById(examId);
        if (exam == null) {
            throw new RuntimeException("Sınav bulunamadı: ID = " + examId);
        }
        
        List<Question> questions = sorularDal.getByExamId(examId);
        if (questions == null || questions.isEmpty()) {
            throw new RuntimeException("Bu sınava ait soru bulunamadı: Exam ID = " + examId);
        }
        
        List<ExamFullDTO.QuestionDTO> questionDTOs = new ArrayList<>();
        
        for (Question question : questions) {
            List<Option> options = seceneklerDal.getByQuestionId(question.getId());
            
            if (options == null || options.isEmpty()) {
                System.err.println("UYARI: Soru ID " + question.getId() + " için seçenek bulunamadı!");
                options = new ArrayList<>();
            }
            
            List<ExamFullDTO.OptionDTO> optionDTOs = options.stream()
                .map(option -> new ExamFullDTO.OptionDTO(
                    option.getId(),
                    option.getText()
                ))
                .collect(Collectors.toList());
            
            ExamFullDTO.QuestionDTO questionDTO = new ExamFullDTO.QuestionDTO(
                question.getId(),
                question.getText(),
                question.getType().toString(),
                optionDTOs
            );
            
            questionDTOs.add(questionDTO);
        }
        
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
    
    @Override
    @Transactional
    public ExamResultDTO submitExamAndCalculateScore(ExamSubmissionDTO submission) {
        Exam exam = sinavlarDal.getById(submission.getExamId());
        User student = kullanicilarDal.getById(submission.getStudentId());
        
        if (exam == null) {
            throw new RuntimeException("Sınav bulunamadı: ID = " + submission.getExamId());
        }
        if (student == null) {
            throw new RuntimeException("Öğrenci bulunamadı: ID = " + submission.getStudentId());
        }
        
        List<Question> questions = sorularDal.getByExamId(submission.getExamId());
        if (questions == null || questions.isEmpty()) {
            throw new RuntimeException("Bu sınava ait soru bulunamadı");
        }
        
        int totalQuestions = questions.size();
        int correctAnswers = 0;
        int wrongAnswers = 0;
        int emptyAnswers = 0;
        
        List<ExamResultDTO.QuestionResultDTO> questionResults = new ArrayList<>();
        
        for (Question question : questions) {
            List<Option> options = seceneklerDal.getByQuestionId(question.getId());
            List<Integer> correctOptionIds = options.stream()
                .filter(Option::isCorrect)
                .map(Option::getId)
                .collect(Collectors.toList());
            
            ExamSubmissionDTO.AnswerDTO studentAnswer = submission.getAnswers().stream()
                .filter(ans -> ans.getQuestionId() == question.getId())
                .findFirst()
                .orElse(null);
            
            boolean isCorrect = false;
            boolean isEmpty = false;
            
            if (studentAnswer == null || studentAnswer.getSelectedOptionIds() == null || 
                studentAnswer.getSelectedOptionIds().isEmpty()) {
                isEmpty = true;
                emptyAnswers++;
            } else {
                List<Integer> selectedIds = studentAnswer.getSelectedOptionIds();
                isCorrect = selectedIds.size() == correctOptionIds.size() &&
                           selectedIds.containsAll(correctOptionIds) &&
                           correctOptionIds.containsAll(selectedIds);
                
                if (isCorrect) {
                    correctAnswers++;
                } else {
                    wrongAnswers++;
                }
            }
            
            ExamResultDTO.QuestionResultDTO questionResult = new ExamResultDTO.QuestionResultDTO(
                question.getId(),
                question.getText(),
                question.getType().toString(),
                studentAnswer != null ? studentAnswer.getSelectedOptionIds() : new ArrayList<>(),
                correctOptionIds,
                isCorrect,
                isEmpty
            );
            
            questionResults.add(questionResult);
        }
        
        BigDecimal score = BigDecimal.ZERO;
        if (totalQuestions > 0) {
            score = BigDecimal.valueOf(correctAnswers)
                .multiply(BigDecimal.valueOf(100))
                .divide(BigDecimal.valueOf(totalQuestions), 2, RoundingMode.HALF_UP);
        }
        
        ExamResult examResult = new ExamResult();
        examResult.setExam(exam);
        examResult.setStudent(student);
        examResult.setScore(score);
        examResult.setFinishedAt(LocalDateTime.now());
        
        sonuclarDal.add(examResult);
        
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
    
    @Override
    @Transactional
    public int createExamWithQuestions(ExamCreateDTO examCreateDTO) {
        Course course = derslerDal.getById(examCreateDTO.getCourseId());
        if (course == null) {
            throw new RuntimeException("Ders bulunamadı: ID = " + examCreateDTO.getCourseId());
        }
        
        Exam exam = new Exam();
        exam.setCourse(course);
        exam.setTitle(examCreateDTO.getTitle());
        exam.setDescription(examCreateDTO.getDescription());
        exam.setDurationMinutes(examCreateDTO.getDurationMinutes());
        exam.setCreatedAt(LocalDateTime.now());
        
        sinavlarDal.add(exam);
        System.out.println("✅ Sınav oluşturuldu: ID = " + exam.getId());
        
        if (examCreateDTO.getQuestions() == null || examCreateDTO.getQuestions().isEmpty()) {
            throw new RuntimeException("En az bir soru eklemelisiniz");
        }
        
        for (ExamCreateDTO.QuestionCreateDTO questionDTO : examCreateDTO.getQuestions()) {
            Question question = new Question();
            question.setExam(exam);
            question.setText(questionDTO.getText());
            
            try {
                question.setType(Question.QuestionType.valueOf(questionDTO.getType()));
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Geçersiz soru tipi: " + questionDTO.getType() + 
                                         ". Geçerli tipler: CoktanSecmeli, DogruYanlis");
            }
            
            sorularDal.add(question);
            System.out.println("  ✅ Soru eklendi: ID = " + question.getId() + ", Tip = " + question.getType());
            
            if (questionDTO.getOptions() == null || questionDTO.getOptions().isEmpty()) {
                throw new RuntimeException("Her soru için en az bir seçenek gereklidir");
            }
            
            boolean hasCorrectOption = false;
            
            for (ExamCreateDTO.OptionCreateDTO optionDTO : questionDTO.getOptions()) {
                Option option = new Option();
                option.setQuestion(question);
                option.setText(optionDTO.getText());
                option.setCorrect(optionDTO.getIsCorrect());
                
                if (optionDTO.getIsCorrect()) {
                    hasCorrectOption = true;
                }
                
                seceneklerDal.add(option);
                System.out.println("    ✅ Seçenek eklendi: ID = " + option.getId() + 
                                 ", Doğru = " + option.isCorrect());
            }
            
            if (!hasCorrectOption) {
                throw new RuntimeException("Soru '" + questionDTO.getText() + 
                                         "' için en az bir doğru cevap işaretlenmelidir");
            }
        }
        
        System.out.println("🎉 Sınav ve tüm sorular başarıyla oluşturuldu!");
        return exam.getId();
    }
}
