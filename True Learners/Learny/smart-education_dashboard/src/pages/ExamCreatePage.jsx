// src/pages/ExamCreatePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { createExam } from '../api/examApi';
import { getCoursesByTeacher } from '../api/courseApi';
import './ExamCreatePage.css';

/**
 * EXAM CREATE PAGE - Sınav Oluşturma Sayfası
 * 
 * SADECE ÖĞRETMENLER İÇİN
 * 
 * ÖZELLİKLER:
 * - Sınav bilgileri girme (başlık, açıklama, süre)
 * - Ders seçimi (öğretmenin dersleri)
 * - Dinamik soru ekleme
 * - Çoktan seçmeli ve Doğru/Yanlış soru tipleri
 * - Seçenek ekleme ve doğru cevap işaretleme
 */

const ExamCreatePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Öğretmen değilse yönlendir
  useEffect(() => {
    if (user?.role !== 'Ogretmen') {
      navigate('/exams');
    }
  }, [user, navigate]);

  // State
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Sınav bilgileri
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    durationMinutes: 30,
    courseId: ''
  });

  // Sorular
  const [questions, setQuestions] = useState([]);

  // Dersleri yükle
  useEffect(() => {
    loadCourses();
  }, [user]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const teacherCourses = await getCoursesByTeacher(user.id);
      setCourses(teacherCourses);
      if (teacherCourses.length > 0) {
        setExamData(prev => ({ ...prev, courseId: teacherCourses[0].id }));
      }
    } catch (err) {
      console.error('Dersler yüklenirken hata:', err);
      setError('Dersler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sınav bilgisi değişikliği
   */
  const handleExamChange = (e) => {
    const { name, value } = e.target;
    setExamData(prev => ({
      ...prev,
      [name]: name === 'durationMinutes' || name === 'courseId' ? parseInt(value) : value
    }));
  };

  /**
   * Yeni soru ekle
   */
  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(), // Geçici ID
      text: '',
      type: 'CoktanSecmeli',
      options: [
        { id: Date.now() + 1, text: '', isCorrect: false },
        { id: Date.now() + 2, text: '', isCorrect: false },
        { id: Date.now() + 3, text: '', isCorrect: false },
        { id: Date.now() + 4, text: '', isCorrect: false }
      ]
    };
    setQuestions(prev => [...prev, newQuestion]);
  };

  /**
   * Soru sil
   */
  const removeQuestion = (questionId) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  /**
   * Soru metnini güncelle
   */
  const updateQuestionText = (questionId, text) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, text } : q
    ));
  };

  /**
   * Soru tipini güncelle
   */
  const updateQuestionType = (questionId, type) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q;
      
      // Tip değişince seçenekleri sıfırla
      const options = type === 'DogruYanlis' 
        ? [
            { id: Date.now() + 1, text: 'Doğru', isCorrect: false },
            { id: Date.now() + 2, text: 'Yanlış', isCorrect: false }
          ]
        : [
            { id: Date.now() + 1, text: '', isCorrect: false },
            { id: Date.now() + 2, text: '', isCorrect: false },
            { id: Date.now() + 3, text: '', isCorrect: false },
            { id: Date.now() + 4, text: '', isCorrect: false }
          ];
      
      return { ...q, type, options };
    }));
  };

  /**
   * Seçenek metnini güncelle
   */
  const updateOptionText = (questionId, optionId, text) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q;
      
      const options = q.options.map(o => 
        o.id === optionId ? { ...o, text } : o
      );
      
      return { ...q, options };
    }));
  };

  /**
   * Doğru cevabı işaretle
   */
  const setCorrectOption = (questionId, optionId) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q;
      
      const options = q.options.map(o => ({
        ...o,
        isCorrect: o.id === optionId
      }));
      
      return { ...q, options };
    }));
  };

  /**
   * Seçenek ekle
   */
  const addOption = (questionId) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q;
      if (q.options.length >= 6) return q; // Maksimum 6 seçenek
      
      const newOption = { id: Date.now(), text: '', isCorrect: false };
      return { ...q, options: [...q.options, newOption] };
    }));
  };

  /**
   * Seçenek sil
   */
  const removeOption = (questionId, optionId) => {
    setQuestions(prev => prev.map(q => {
      if (q.id !== questionId) return q;
      if (q.options.length <= 2) return q; // Minimum 2 seçenek
      
      const options = q.options.filter(o => o.id !== optionId);
      return { ...q, options };
    }));
  };

  /**
   * Form validasyonu
   */
  const validateForm = () => {
    if (!examData.title.trim()) {
      setError('Sınav başlığı gereklidir.');
      return false;
    }
    
    if (!examData.courseId) {
      setError('Ders seçimi gereklidir.');
      return false;
    }
    
    if (examData.durationMinutes < 1) {
      setError('Sınav süresi en az 1 dakika olmalıdır.');
      return false;
    }
    
    if (questions.length === 0) {
      setError('En az bir soru eklemelisiniz.');
      return false;
    }
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      
      if (!q.text.trim()) {
        setError(`Soru ${i + 1}: Soru metni gereklidir.`);
        return false;
      }
      
      const hasCorrectAnswer = q.options.some(o => o.isCorrect);
      if (!hasCorrectAnswer) {
        setError(`Soru ${i + 1}: Doğru cevap işaretlenmelidir.`);
        return false;
      }
      
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].text.trim()) {
          setError(`Soru ${i + 1}, Seçenek ${j + 1}: Seçenek metni gereklidir.`);
          return false;
        }
      }
    }
    
    return true;
  };

  /**
   * Sınavı kaydet
   */
  const handleSubmit = async () => {
    setError(null);
    
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      const examPayload = {
        title: examData.title,
        description: examData.description,
        durationMinutes: examData.durationMinutes,
        courseId: examData.courseId,
        questions: questions.map(q => ({
          text: q.text,
          type: q.type,
          options: q.options.map(o => ({
            text: o.text,
            isCorrect: o.isCorrect
          }))
        }))
      };
      
      await createExam(examPayload);
      
      alert('Sınav başarıyla oluşturuldu!');
      navigate('/exams');
      
    } catch (err) {
      console.error('Sınav oluşturulurken hata:', err);
      setError('Sınav oluşturulamadı. Lütfen tekrar deneyin.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Çıkış hatası:', error);
      navigate('/login');
    }
  };

  const handleNavigate = (page) => {
    navigate(`/${page}`);
  };

  if (loading) {
    return (
      <div className="layout">
        <Sidebar onNavigate={handleNavigate} onLogout={handleLogout} currentPage="exams" />
        <main className="main-area">
          <Topbar user={user} onLogout={handleLogout} />
          <div className="exam-create-loading">
            <div className="spinner"></div>
            <p>Yükleniyor...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar onNavigate={handleNavigate} onLogout={handleLogout} currentPage="exams" />
      
      <main className="main-area">
        <Topbar user={user} onLogout={handleLogout} />

        <section className="exam-create-section">
          {/* Header */}
          <div className="exam-create-header">
            <button className="btn-back" onClick={() => navigate('/exams')}>
              ← Geri
            </button>
            <h1 className="page-title">📝 Yeni Sınav Oluştur</h1>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Sınav Bilgileri */}
          <div className="exam-info-card">
            <h2 className="card-title">Sınav Bilgileri</h2>
            
            <div className="form-grid">
              <div className="form-group">
                <label>Sınav Başlığı *</label>
                <input
                  type="text"
                  name="title"
                  value={examData.title}
                  onChange={handleExamChange}
                  placeholder="Örn: Matematik Ara Sınavı"
                />
              </div>
              
              <div className="form-group">
                <label>Ders *</label>
                <select
                  name="courseId"
                  value={examData.courseId}
                  onChange={handleExamChange}
                >
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Süre (Dakika) *</label>
                <input
                  type="number"
                  name="durationMinutes"
                  value={examData.durationMinutes}
                  onChange={handleExamChange}
                  min="1"
                  max="180"
                />
              </div>
              
              <div className="form-group full-width">
                <label>Açıklama</label>
                <textarea
                  name="description"
                  value={examData.description}
                  onChange={handleExamChange}
                  placeholder="Sınav hakkında kısa bir açıklama..."
                  rows="3"
                />
              </div>
            </div>
          </div>

          {/* Sorular */}
          <div className="questions-section">
            <div className="questions-header">
              <h2 className="card-title">Sorular ({questions.length})</h2>
              <button className="btn-add-question" onClick={addQuestion}>
                ➕ Soru Ekle
              </button>
            </div>

            {questions.length === 0 ? (
              <div className="empty-questions">
                <div className="empty-icon">📋</div>
                <h3>Henüz soru eklenmedi</h3>
                <p>Yukarıdaki "Soru Ekle" butonunu kullanarak soru ekleyin.</p>
              </div>
            ) : (
              <div className="questions-list">
                {questions.map((question, qIndex) => (
                  <div key={question.id} className="question-card">
                    <div className="question-card-header">
                      <span className="question-number">Soru {qIndex + 1}</span>
                      <div className="question-actions">
                        <select
                          value={question.type}
                          onChange={(e) => updateQuestionType(question.id, e.target.value)}
                          className="question-type-select"
                        >
                          <option value="CoktanSecmeli">Çoktan Seçmeli</option>
                          <option value="DogruYanlis">Doğru / Yanlış</option>
                        </select>
                        <button 
                          className="btn-remove-question"
                          onClick={() => removeQuestion(question.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <div className="question-text-input">
                      <textarea
                        value={question.text}
                        onChange={(e) => updateQuestionText(question.id, e.target.value)}
                        placeholder="Soru metnini yazın..."
                        rows="2"
                      />
                    </div>
                    
                    <div className="options-section">
                      <div className="options-header">
                        <span>Seçenekler</span>
                        {question.type === 'CoktanSecmeli' && question.options.length < 6 && (
                          <button 
                            className="btn-add-option"
                            onClick={() => addOption(question.id)}
                          >
                            + Seçenek Ekle
                          </button>
                        )}
                      </div>
                      
                      <div className="options-list">
                        {question.options.map((option, oIndex) => (
                          <div key={option.id} className="option-item">
                            <div 
                              className={`option-radio ${option.isCorrect ? 'correct' : ''}`}
                              onClick={() => setCorrectOption(question.id, option.id)}
                            >
                              {option.isCorrect ? '✓' : String.fromCharCode(65 + oIndex)}
                            </div>
                            
                            <input
                              type="text"
                              value={option.text}
                              onChange={(e) => updateOptionText(question.id, option.id, e.target.value)}
                              placeholder={`Seçenek ${String.fromCharCode(65 + oIndex)}`}
                              disabled={question.type === 'DogruYanlis'}
                            />
                            
                            {question.type === 'CoktanSecmeli' && question.options.length > 2 && (
                              <button 
                                className="btn-remove-option"
                                onClick={() => removeOption(question.id, option.id)}
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <p className="options-hint">
                        💡 Doğru cevabı seçmek için seçenek harfine tıklayın.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="submit-section">
            <button 
              className="btn-cancel"
              onClick={() => navigate('/exams')}
              disabled={submitting}
            >
              İptal
            </button>
            <button 
              className="btn-submit"
              onClick={handleSubmit}
              disabled={submitting || questions.length === 0}
            >
              {submitting ? 'Kaydediliyor...' : 'Sınavı Oluştur'}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ExamCreatePage;
