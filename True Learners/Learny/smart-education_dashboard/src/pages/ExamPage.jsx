// src/pages/ExamPage.jsx - DÜZELTİLMİŞ VERSİYON
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getExamFull, submitExam } from "../api/examApi";
import { useAuth } from "../contexts/AuthContext";
import "./ExamPage.css";

/**
 * EXAM PAGE - Öğrenci Sınav Alma Sayfası
 * 
 * DÜZELTİLEN SORUNLAR:
 * 1. Sorular görünmüyordu -> Düzgün render eklendi
 * 2. Seçenekler boştu -> options kontrolü düzeltildi
 * 3. DogruYanlis soruları için özel render yoktu -> Eklendi
 * 
 * BACKEND'DEN GELEN VERİ YAPISI (ExamFullDTO):
 * {
 *   examId, title, description, durationMinutes, courseName,
 *   questions: [
 *     {
 *       questionId,
 *       text,
 *       type, // "CoktanSecmeli" veya "DogruYanlis"
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

      // Her sorunun options'ını kontrol et ve logla
      data.questions.forEach((q, idx) => {
        console.log(`Soru ${idx + 1}:`, {
          questionId: q.questionId,
          text: q.text,
          type: q.type,
          optionsCount: q.options ? q.options.length : 0,
          options: q.options
        });

        // Eğer options null veya undefined ise boş array yap
        if (!q.options || !Array.isArray(q.options)) {
          console.warn(`⚠️ Soru ${idx + 1} (ID: ${q.questionId}) için seçenekler boş! Boş array atanıyor.`);
          q.options = [];
        }
      });
      
      setExamData(data);
      
      // Zamanı başlat (dakika -> saniye)
      setTimeRemaining(data.durationMinutes * 60);

      // Cevapları initialize et (boş)
      const initialAnswers = {};
      data.questions.forEach((q) => {
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
   * Süreyi formatla (MM:SS)
   */
  const formatTime = (seconds) => {
    if (seconds === null) return "--:--";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  // ========== RENDER: LOADING ==========
  if (loading) {
    return (
      <div className="exam-page-loading">
        <div className="spinner"></div>
        <p>Sınav yükleniyor...</p>
      </div>
    );
  }

  // ========== RENDER: ERROR ==========
  if (error) {
    return (
      <div className="exam-page-error">
        <p>❌ {error}</p>
        <button onClick={() => navigate("/exams")}>Sınavlara Dön</button>
      </div>
    );
  }

  // ========== RENDER: SINAV VERİLERİ YOK ==========
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

  // Seçenekler kontrolü - boş array olsa bile devam et
  const currentOptions = currentQuestion.options || [];
  
  // Soru tipi kontrolü
  const isDogruYanlis = currentQuestion.type === "DogruYanlis";
  const isCoktanSecmeli = currentQuestion.type === "CoktanSecmeli";

  // ========== ANA RENDER ==========
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
        {/* SORU KARTI */}
        <div className="question-card">
          <div className="question-header">
            <span className="question-number">Soru {currentQuestionIndex + 1}</span>
            <span className="question-type">
              {isDogruYanlis ? "Doğru / Yanlış" : "Çoktan Seçmeli"}
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
                    className={`option-item ${isSelected ? "selected" : ""} ${
                      isDogruYanlis ? "dogru-yanlis-option" : ""
                    }`}
                    onClick={() =>
                      handleAnswerSelect(currentQuestion.questionId, option.optionId)
                    }
                  >
                    {/* DOĞRU/YANLIŞ İÇİN ÖZEL RENDER */}
                    {isDogruYanlis ? (
                      <>
                        <div className="dy-icon">
                          {option.text === "Doğru" || option.text === "True" ? "✓" : "✗"}
                        </div>
                        <div className="dy-text">{option.text}</div>
                      </>
                    ) : (
                      /* ÇOKTAN SEÇMELİ İÇİN RENDER */
                      <>
                        <div className="option-letter">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <div className="option-text">{option.text}</div>
                        <div className="option-check">
                          {isSelected && <span>✓</span>}
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            ) : (
              /* SEÇENEK BULUNAMADI UYARISI */
              <div className="no-options">
                <p>⚠️ Bu soru için seçenek bulunamadı.</p>
                <p style={{ fontSize: "0.9rem", color: "#6b6b84", marginTop: "0.5rem" }}>
                  Lütfen öğretmeninize veya sistem yöneticisine bildirin.
                </p>
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
              {submitting ? "Gönderiliyor..." : "Sınavı Bitir"}
            </button>
          ) : (
            <button
              className="nav-btn next-btn"
              onClick={handleNextQuestion}
            >
              Sonraki Soru →
            </button>
          )}
        </div>

        {/* SORU PALETİ (Tüm soruları göster) */}
        <div className="question-palette">
          <h4>Sorular</h4>
          <div className="palette-grid">
            {examData.questions.map((q, idx) => {
              const isAnswered = answers[q.questionId] && answers[q.questionId].length > 0;
              const isCurrent = idx === currentQuestionIndex;

              return (
                <button
                  key={q.questionId}
                  className={`palette-item ${isCurrent ? "current" : ""} ${
                    isAnswered ? "answered" : ""
                  }`}
                  onClick={() => setCurrentQuestionIndex(idx)}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
          
          {/* İSTATİSTİKLER */}
          <div className="palette-stats">
            <div className="stat-item">
              <span className="stat-icon answered">●</span>
              <span>Cevaplanan: {Object.values(answers).filter(a => a.length > 0).length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon unanswered">○</span>
              <span>Boş: {examData.questions.length - Object.values(answers).filter(a => a.length > 0).length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExamPage;
