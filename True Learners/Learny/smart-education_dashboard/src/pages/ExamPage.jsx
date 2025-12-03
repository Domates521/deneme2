// src/pages/ExamPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExamFull, submitExam } from "../api/examApi";
import { useAuth } from "../contexts/AuthContext";
import "./ExamPage.css";

/**
 * EXAM PAGE - Öğrenci Sınav Alma Sayfası
 * 
 * BACKEND'DEN GELEN VERİ YAPISI (ExamFullDTO):
 * {
 *   examId, title, description, durationMinutes, courseName,
 *   questions: [
 *     {
 *       questionId,
 *       text,
 *       type,
 *       options: [{ optionId, text }, ...]
 *     }
 *   ]
 * }
 */

function ExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // STATE
  const [examData, setExamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /**
   * Sınavı bitir ve gönder
   */
  const handleSubmitExam = useCallback(async (isAutoSubmit = false) => {
    if (submitting || submitted) return;

    // Manuel gönderimde onay al
    if (!isAutoSubmit) {
      const confirmed = window.confirm(
        "Sınavı bitirmek istediğinize emin misiniz? Cevaplarınız gönderilecek."
      );
      if (!confirmed) return;
    }

    try {
      setSubmitting(true);
      setSubmitted(true);

      // Cevapları backend formatına dönüştür
      const formattedAnswers = Object.keys(answers).map((questionId) => ({
        questionId: parseInt(questionId),
        selectedOptionIds: answers[questionId] || [],
      }));

      const submission = {
        examId: parseInt(examId),
        studentId: user.id,
        answers: formattedAnswers,
      };

      console.log("📤 Gönderilen veri:", JSON.stringify(submission, null, 2));

      // Backend'e gönder
      const result = await submitExam(submission);

      console.log("📥 Alınan sonuç:", JSON.stringify(result, null, 2));

      // Sonuç sayfasına yönlendir
      navigate(`/exam-result/${result.resultId}`, {
        state: { result },
      });
    } catch (error) {
      console.error("Sınav gönderilirken hata:", error);
      alert("Sınav gönderilemedi. Lütfen tekrar deneyin.");
      setSubmitting(false);
      setSubmitted(false);
    }
  }, [submitting, submitted, answers, examId, user.id, navigate]);

  /**
   * Sınav verilerini backend'den yükle
   */
  const loadExamData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getExamFull(examId);
      
      console.log("📥 Sınav verisi:", JSON.stringify(data, null, 2));
      
      // Veri kontrolü
      if (!data) {
        throw new Error("Sınav verisi alınamadı");
      }
      
      if (!data.questions || data.questions.length === 0) {
        throw new Error("Bu sınavda soru bulunmuyor");
      }

      // Her sorunun options'ını kontrol et
      data.questions.forEach((q, idx) => {
        console.log(`Soru ${idx + 1}:`, q.questionId, q.text);
        console.log(`  Options:`, q.options);
      });
      
      setExamData(data);
      
      // Zamanı başlat (dakika -> saniye)
      setTimeRemaining(data.durationMinutes * 60);

      // Cevapları initialize et (boş)
      const initialAnswers = {};
      data.questions.forEach((q) => {
        // Backend'den questionId geliyor
        initialAnswers[q.questionId] = [];
      });
      setAnswers(initialAnswers);

    } catch (error) {
      console.error("Sınav yüklenirken hata:", error);
      setError(error.message || "Sınav yüklenemedi. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }, [examId]);

  /**
   * COMPONENT MOUNT - Sınav verilerini yükle
   */
  useEffect(() => {
    loadExamData();
  }, [loadExamData]);

  /**
   * ZAMANLAYICI - Her saniye kalan süreyi azalt
   */
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || submitted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Süre bitti - Otomatik gönder
          clearInterval(timer);
          handleSubmitExam(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, submitted, handleSubmitExam]);

  /**
   * Cevap seçimi
   */
  const handleAnswerSelect = (questionId, optionId) => {
    console.log(`Cevap seçildi: Soru ${questionId}, Seçenek ${optionId}`);
    setAnswers((prev) => {
      // Tek seçim: Üzerine yaz
      return {
        ...prev,
        [questionId]: [optionId],
      };
    });
  };

  /**
   * İleri butonuna tıklama
   */
  const handleNextQuestion = () => {
    if (examData && currentQuestionIndex < examData.questions.length - 1) {
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
   * Süreyi formatla (MM:SS)
   */
  const formatTime = (seconds) => {
    if (seconds === null) return "--:--";
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

  // ERROR
  if (error) {
    return (
      <div className="exam-page-error">
        <p>❌ {error}</p>
        <button onClick={() => navigate("/exams")}>Sınavlara Dön</button>
      </div>
    );
  }

  // SINAV VERİLERİ YOK
  if (!examData || !examData.questions || examData.questions.length === 0) {
    return (
      <div className="exam-page-error">
        <p>Sınav bulunamadı veya sorular yüklenemedi.</p>
        <button onClick={() => navigate("/exams")}>Geri Dön</button>
      </div>
    );
  }

  const currentQuestion = examData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / examData.questions.length) * 100;

  // Mevcut soru kontrolü
  if (!currentQuestion) {
    return (
      <div className="exam-page-error">
        <p>Soru yüklenemedi.</p>
        <button onClick={() => navigate("/exams")}>Geri Dön</button>
      </div>
    );
  }

  // Seçenekler kontrolü
  const currentOptions = currentQuestion.options || [];

  return (
    <div className="exam-page">
      {/* HEADER */}
      <div className="exam-header">
        <div className="exam-header-left">
          <h1>{examData.title}</h1>
          <p className="exam-course">{examData.courseName}</p>
        </div>

        <div className="exam-header-right">
          {/* ZAMANLAYICI */}
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

          {/* SEÇENEKLER */}
          <div className="options-list">
            {currentOptions.length > 0 ? (
              currentOptions.map((option, index) => {
                // Backend'den optionId geliyor
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
              })
            ) : (
              <div className="no-options">
                <p>⚠️ Bu soru için seçenek bulunamadı.</p>
              </div>
            )}
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
              onClick={() => handleSubmitExam(false)}
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
              // Backend'den questionId geliyor
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
              <span>Cevaplandı</span>
            </div>
            <div className="legend-item">
              <div className="legend-box unanswered"></div>
              <span>Cevaplanmadı</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamPage;
