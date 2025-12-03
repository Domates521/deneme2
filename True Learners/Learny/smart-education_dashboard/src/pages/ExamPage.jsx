// src/pages/ExamPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExamFull, submitExam } from "../api/examApi";
import { useAuth } from "../contexts/AuthContext";
import "../styles/ExamPage.css";

/**
 * EXAM PAGE - Öğrenci Sınav Alma Sayfası
 * 
 * ÖZELLİKLER:
 * ✅ Geri sayım zamanlayıcı (süre bitince otomatik gönderim)
 * ✅ Soru navigasyonu (ileri/geri butonları)
 * ✅ Çoktan seçmeli + Doğru/Yanlış soruları
 * ✅ Cevap seçimi ve kaydetme
 * ✅ Sınavı bitirme ve puanlama
 * ✅ Sonuç sayfasına yönlendirme
 * 
 * AKIŞ:
 * 1. Component mount -> Sınav verilerini yükle
 * 2. Zamanlayıcı başlat
 * 3. Öğrenci soruları cevaplar
 * 4. "Sınavı Bitir" veya süre bitince -> Cevapları gönder
 * 5. Sonuç sayfasına yönlendir
 */

function ExamPage() {
  const { examId } = useParams(); // URL'den sınav ID'sini al
  const navigate = useNavigate();
  const { user } = useAuth();

  // STATE
  const [examData, setExamData] = useState(null); // Sınav verileri
  const [loading, setLoading] = useState(true); // Yükleniyor mu?
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Şu anki soru
  const [answers, setAnswers] = useState({}); // Öğrencinin cevapları
  const [timeRemaining, setTimeRemaining] = useState(null); // Kalan süre (saniye)
  const [submitting, setSubmitting] = useState(false); // Gönderiliyor mu?

  /**
   * COMPONENT MOUNT - Sınav verilerini yükle
   */
  useEffect(() => {
    loadExamData();
  }, [examId]);

  /**
   * ZAMANLAYıCı - Her saniye kalan süreyi azalt
   */
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Süre bitti - Otomatik gönder
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  /**
   * Sınav verilerini backend'den yükle
   */
  const loadExamData = async () => {
    try {
      setLoading(true);
      const data = await getExamFull(examId);
      setExamData(data);

      // Zamanı başlat (dakika -> saniye)
      setTimeRemaining(data.durationMinutes * 60);

      // Cevapları initialize et (boş)
      const initialAnswers = {};
      data.questions.forEach((q) => {
        initialAnswers[q.questionId] = [];
      });
      setAnswers(initialAnswers);

      setLoading(false);
    } catch (error) {
      console.error("Sınav yüklenirken hata:", error);
      alert("Sınav yüklenemedi. Lütfen tekrar deneyin.");
      navigate("/exams");
    }
  };

  /**
   * Cevap seçimi
   * 
   * @param {number} questionId - Soru ID
   * @param {number} optionId - Seçenek ID
   * @param {boolean} multipleChoice - Çoklu seçim mi?
   */
  const handleAnswerSelect = (questionId, optionId, multipleChoice = false) => {
    setAnswers((prev) => {
      if (multipleChoice) {
        // Çoklu seçim: Toggle (seçili ise kaldır, değilse ekle)
        const currentAnswers = prev[questionId] || [];
        if (currentAnswers.includes(optionId)) {
          return {
            ...prev,
            [questionId]: currentAnswers.filter((id) => id !== optionId),
          };
        } else {
          return {
            ...prev,
            [questionId]: [...currentAnswers, optionId],
          };
        }
      } else {
        // Tek seçim: Üzerine yaz
        return {
          ...prev,
          [questionId]: [optionId],
        };
      }
    });
  };

  /**
   * İleri butonuna tıklama
   */
  const handleNextQuestion = () => {
    if (currentQuestionIndex < examData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  /**
   * Geri butonuna tıklama
   */
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  /**
   * Belirli bir soruya git
   */
  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  /**
   * Sınavı bitir ve gönder
   */
  const handleSubmitExam = async () => {
    if (submitting) return; // Zaten gönderiliyor

    // Onay al
    const confirmed = window.confirm(
      "Sınavı bitirmek istediğinize emin misiniz? Cevaplarınız gönderilecek."
    );

    if (!confirmed && timeRemaining > 0) return; // Süre varken iptal edilebilir

    try {
      setSubmitting(true);

      // Cevapları backend formatına dönüştür
      const formattedAnswers = Object.keys(answers).map((questionId) => ({
        questionId: parseInt(questionId),
        selectedOptionIds: answers[questionId],
      }));

      const submission = {
        examId: parseInt(examId),
        studentId: user.id,
        answers: formattedAnswers,
      };

      // Backend'e gönder
      const result = await submitExam(submission);

      // Sonuç sayfasına yönlendir
      navigate(`/exam-result/${result.resultId}`, {
        state: { result },
      });
    } catch (error) {
      console.error("Sınav gönderilirken hata:", error);
      alert("Sınav gönderilemedi. Lütfen tekrar deneyin.");
      setSubmitting(false);
    }
  };

  /**
   * Süreyi formatla (MM:SS)
   */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // LOADING
  if (loading) {
    return (
      <div className="exam-page-loading">
        <div className="spinner"></div>
        <p>Sınav yükleniyor...</p>
      </div>
    );
  }

  // SINAV VERİLERİ YOK
  if (!examData) {
    return (
      <div className="exam-page-error">
        <p>Sınav bulunamadı.</p>
        <button onClick={() => navigate("/exams")}>Geri Dön</button>
      </div>
    );
  }

  const currentQuestion = examData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / examData.questions.length) * 100;

  return (
    <div className="exam-page">
      {/* HEADER */}
      <div className="exam-header">
        <div className="exam-header-left">
          <h1>{examData.title}</h1>
          <p className="exam-course">{examData.courseName}</p>
        </div>

        <div className="exam-header-right">
          {/* ZAMANLAYıCı */}
          <div className={`exam-timer ${timeRemaining < 300 ? "warning" : ""}`}>
            <span className="timer-icon">⏱️</span>
            <span className="timer-text">{formatTime(timeRemaining)}</span>
          </div>

          {/* İLERLEME */}
          <div className="exam-progress-text">
            Soru {currentQuestionIndex + 1} / {examData.questions.length}
          </div>
        </div>
      </div>

      {/* İLERLEME BARI */}
      <div className="exam-progress-bar">
        <div className="exam-progress-fill" style={{ width: `${progress}%` }}></div>
      </div>

      {/* SINAV İÇERİĞİ */}
      <div className="exam-content">
        {/* SORU */}
        <div className="question-card">
          <div className="question-header">
            <span className="question-number">Soru {currentQuestionIndex + 1}</span>
            <span className="question-type">
              {currentQuestion.type === "CoktanSecmeli"
                ? "Çoktan Seçmeli"
                : "Doğru / Yanlış"}
            </span>
          </div>

          <div className="question-text">{currentQuestion.text}</div>

          {/* SEÇENEKLEcluster */}
          <div className="options-list">
            {currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentQuestion.questionId]?.includes(
                option.optionId
              );

              return (
                <div
                  key={option.optionId}
                  className={`option-item ${isSelected ? "selected" : ""}`}
                  onClick={() =>
                    handleAnswerSelect(currentQuestion.questionId, option.optionId)
                  }
                >
                  <div className="option-letter">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="option-text">{option.text}</div>
                  <div className="option-check">
                    {isSelected && <span>✓</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* NAVİGASYON BUTONLARI */}
        <div className="exam-navigation">
          <button
            className="nav-btn prev-btn"
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            ← Önceki Soru
          </button>

          {currentQuestionIndex === examData.questions.length - 1 ? (
            <button
              className="nav-btn submit-btn"
              onClick={handleSubmitExam}
              disabled={submitting}
            >
              {submitting ? "Gönderiliyor..." : "Sınavı Bitir ✓"}
            </button>
          ) : (
            <button className="nav-btn next-btn" onClick={handleNextQuestion}>
              Sonraki Soru →
            </button>
          )}
        </div>

        {/* SORU HARİTASI */}
        <div className="question-map">
          <h3>Sorular</h3>
          <div className="question-map-grid">
            {examData.questions.map((q, index) => {
              const answered = answers[q.questionId]?.length > 0;
              const isCurrent = index === currentQuestionIndex;

              return (
                <div
                  key={q.questionId}
                  className={`question-map-item ${isCurrent ? "current" : ""} ${
                    answered ? "answered" : ""
                  }`}
                  onClick={() => goToQuestion(index)}
                >
                  {index + 1}
                </div>
              );
            })}
          </div>

          <div className="question-map-legend">
            <div className="legend-item">
              <div className="legend-box answered"></div>
              <span>Cevaplanmış</span>
            </div>
            <div className="legend-item">
              <div className="legend-box unanswered"></div>
              <span>Cevaplanmamış</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamPage;