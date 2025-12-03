// src/pages/ExamResultPage.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './ExamResultPage.css';

/**
 * EXAM RESULT PAGE - Sınav Sonuç Sayfası
 * 
 * BACKEND'DEN GELEN VERİ YAPISI (ExamResultDTO):
 * {
 *   resultId, examId, examTitle, studentId, studentName,
 *   score, totalQuestions, correctAnswers, wrongAnswers, emptyAnswers,
 *   finishedAt,
 *   questionResults: [
 *     {
 *       questionId,
 *       questionText,
 *       correct (boolean) - Java'da isCorrect(), JSON'da "correct" olarak gelir
 *       studentAnswer,    // Öğrencinin cevap metni (String)
 *       correctAnswer     // Doğru cevap metni (String)
 *     }
 *   ]
 * }
 */

const ExamResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Sonuç verisi ExamPage'den geliyor
  const result = location.state?.result;

  console.log("📊 Sonuç verisi:", JSON.stringify(result, null, 2));

  // Sonuç yoksa geri yönlendir
  if (!result) {
    return (
      <div className="exam-result-page">
        <div className="result-error">
          <div className="error-icon">❌</div>
          <h2>Sonuç Bulunamadı</h2>
          <p>Sınav sonucunuz bulunamadı. Lütfen tekrar deneyin.</p>
          <button className="btn-back-home" onClick={() => navigate('/exams')}>
            Sınavlara Dön
          </button>
        </div>
      </div>
    );
  }

  const score = parseFloat(result.score) || 0;
  const isPassed = score >= 50;
  const totalQuestions = result.totalQuestions || 0;
  const correctAnswers = result.correctAnswers || 0;
  const wrongAnswers = result.wrongAnswers || 0;
  const emptyAnswers = result.emptyAnswers || 0;
  const questionResults = result.questionResults || [];

  /**
   * Puan dairesinin renk gradyanı
   */
  const getScoreGradient = () => {
    if (score >= 80) return 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)';
    if (score >= 50) return 'linear-gradient(135deg, #f39c12 0%, #f1c40f 100%)';
    return 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)';
  };

  /**
   * Başarı mesajı
   */
  const getResultMessage = () => {
    if (score >= 90) return { emoji: '🏆', text: 'Mükemmel! Harika bir performans!' };
    if (score >= 80) return { emoji: '🌟', text: 'Çok İyi! Başarılı bir sonuç!' };
    if (score >= 70) return { emoji: '👏', text: 'İyi! Güzel bir çalışma!' };
    if (score >= 50) return { emoji: '✅', text: 'Geçer Not! Biraz daha çalışabilirsin.' };
    return { emoji: '📚', text: 'Tekrar Çalış! Bir sonraki sınavda başarılı olacaksın.' };
  };

  /**
   * Soru sonucu durumunu belirle
   * 
   * Java'da boolean için isCorrect() getter'ı kullanıldığında,
   * Jackson JSON serializasyonu "correct" olarak gönderir.
   * Ama bazen "isCorrect" olarak da gelebilir.
   */
  const getQuestionStatus = (qr) => {
    // Her iki olasılığı da kontrol et: "correct" veya "isCorrect"
    const isCorrectValue = qr.correct !== undefined ? qr.correct : qr.isCorrect;
    const isCorrect = isCorrectValue === true;
    
    // Boş cevap kontrolü
    const studentAns = qr.studentAnswer;
    const isEmpty = !studentAns || 
                    studentAns === "Boş" || 
                    studentAns.trim() === "" ||
                    studentAns === null;
    
    console.log(`Soru ${qr.questionId}: correct=${qr.correct}, isCorrect=${qr.isCorrect}, hesaplanan=${isCorrect}, boş=${isEmpty}`);
    
    return { isCorrect, isEmpty };
  };

  const resultMessage = getResultMessage();

  return (
    <div className="exam-result-page">
      <div className="result-container">
        {/* Header */}
        <div className="result-header">
          <h1 className="result-title">{result.examTitle || 'Sınav Sonucu'}</h1>
          {result.courseName && (
            <p className="result-course">{result.courseName}</p>
          )}
        </div>

        {/* Score Circle */}
        <div className="score-section">
          <div 
            className="score-circle"
            style={{ background: getScoreGradient() }}
          >
            <div className="score-value">{score.toFixed(1)}</div>
            <div className="score-label">Puan</div>
          </div>
          
          <div className="result-message">
            <span className="message-emoji">{resultMessage.emoji}</span>
            <span className="message-text">{resultMessage.text}</span>
          </div>
          
          <div className={`pass-status ${isPassed ? 'passed' : 'failed'}`}>
            {isPassed ? '✓ GEÇTİN' : '✗ KALDIN'}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-section">
          <div className="stat-box total">
            <div className="stat-number">{totalQuestions}</div>
            <div className="stat-label">Toplam Soru</div>
          </div>
          <div className="stat-box correct">
            <div className="stat-number">{correctAnswers}</div>
            <div className="stat-label">Doğru</div>
          </div>
          <div className="stat-box wrong">
            <div className="stat-number">{wrongAnswers}</div>
            <div className="stat-label">Yanlış</div>
          </div>
          <div className="stat-box empty">
            <div className="stat-number">{emptyAnswers}</div>
            <div className="stat-label">Boş</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-section">
          <div className="progress-bar">
            {totalQuestions > 0 && (
              <>
                <div 
                  className="progress-correct" 
                  style={{ width: `${(correctAnswers / totalQuestions) * 100}%` }}
                ></div>
                <div 
                  className="progress-wrong" 
                  style={{ width: `${(wrongAnswers / totalQuestions) * 100}%` }}
                ></div>
                <div 
                  className="progress-empty" 
                  style={{ width: `${(emptyAnswers / totalQuestions) * 100}%` }}
                ></div>
              </>
            )}
          </div>
          <div className="progress-legend">
            <span className="legend-item correct">
              <span className="legend-dot"></span> Doğru
            </span>
            <span className="legend-item wrong">
              <span className="legend-dot"></span> Yanlış
            </span>
            <span className="legend-item empty">
              <span className="legend-dot"></span> Boş
            </span>
          </div>
        </div>

        {/* Question Results */}
        {questionResults.length > 0 && (
          <div className="questions-section">
            <h2 className="section-title">Soru Detayları</h2>
            <div className="question-results-list">
              {questionResults.map((qr, index) => {
                const { isCorrect, isEmpty } = getQuestionStatus(qr);
                
                // Durum sınıfını belirle
                let statusClass = 'wrong';
                let statusText = '✗ Yanlış';
                
                if (isCorrect) {
                  statusClass = 'correct';
                  statusText = '✓ Doğru';
                } else if (isEmpty) {
                  statusClass = 'empty';
                  statusText = '○ Boş';
                }

                return (
                  <div 
                    key={qr.questionId || index} 
                    className={`question-result-item ${statusClass}`}
                  >
                    <div className="question-result-header">
                      <span className="question-num">Soru {index + 1}</span>
                      <span className={`question-status ${statusClass}`}>
                        {statusText}
                      </span>
                    </div>
                    
                    <p className="question-text">{qr.questionText}</p>
                    
                    <div className="question-answer-info">
                      {/* Öğrencinin cevabı */}
                      <div className="answer-row">
                        <span className="answer-label">Senin cevabın:</span>
                        {isEmpty ? (
                          <span className="answer-value empty-answer">Boş bırakıldı</span>
                        ) : (
                          <span className={`answer-value ${isCorrect ? 'correct' : 'wrong'}`}>
                            {qr.studentAnswer}
                          </span>
                        )}
                      </div>
                      
                      {/* Yanlış veya boşsa doğru cevabı göster */}
                      {!isCorrect && (
                        <div className="answer-row">
                          <span className="answer-label">Doğru cevap:</span>
                          <span className="answer-value correct">{qr.correctAnswer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="actions-section">
          <button className="btn-back" onClick={() => navigate('/exams')}>
            ← Sınavlara Dön
          </button>
          <button className="btn-dashboard" onClick={() => navigate('/dashboard')}>
            Dashboard'a Git
          </button>
        </div>

        {/* Timestamp */}
        {result.finishedAt && (
          <div className="result-timestamp">
            Tamamlanma: {new Date(result.finishedAt).toLocaleString('tr-TR')}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamResultPage;
