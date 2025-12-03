// src/pages/ExamsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { getAllExams, getExamsByCourse } from '../api/examApi';
import { getEnrollmentsByStudent } from '../api/enrollmentApi';
import { getResultsByStudent, getResultsByExam } from '../api/examResultApi';
import './ExamsPage.css';

/**
 * EXAMS PAGE - Sınavlar Sayfası
 * 
 * ÖĞRENCİLER İÇİN:
 * - Girebilecekleri sınavları görür
 * - Geçmiş sınav sonuçlarını görür
 * - Aktif sınavlara katılabilir
 * 
 * ÖĞRETMENLER İÇİN:
 * - Tüm sınavları görür
 * - Yeni sınav oluşturabilir
 * - Sınav sonuçlarını detaylı inceleyebilir
 */

const ExamsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [availableExams, setAvailableExams] = useState([]); // Girilebilir sınavlar
  const [completedExams, setCompletedExams] = useState([]); // Tamamlanan sınavlar
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('available'); // 'available' | 'completed'
  
  // Öğretmen state'leri
  const [allExams, setAllExams] = useState([]);
  const [selectedExamResults, setSelectedExamResults] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  
  const isTeacher = user?.role === 'Ogretmen';

  useEffect(() => {
    if (isTeacher) {
      loadTeacherExams();
    } else {
      loadStudentExams();
    }
  }, [user, isTeacher]);

  /**
   * Öğrenci için sınavları yükle
   */
  const loadStudentExams = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Öğrencinin kayıtlı olduğu dersleri al
      const enrollments = await getEnrollmentsByStudent(user.id);
      const courseIds = enrollments.map(e => e.course.id);

      // 2. Öğrencinin tamamladığı sınavları al
      const results = await getResultsByStudent(user.id);
      const completedExamIds = results.map(r => r.exam?.id || r.examId);
      
      setCompletedExams(results);

      // 3. Kayıtlı derslerin sınavlarını al
      let allAvailableExams = [];
      for (const courseId of courseIds) {
        const exams = await getExamsByCourse(courseId);
        allAvailableExams = [...allAvailableExams, ...exams];
      }

      // 4. Tamamlanmamış sınavları filtrele
      const notCompletedExams = allAvailableExams.filter(
        exam => !completedExamIds.includes(exam.id)
      );

      setAvailableExams(notCompletedExams);
      
    } catch (err) {
      console.error('Sınavlar yüklenirken hata:', err);
      setError('Sınavlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Öğretmen için sınavları yükle
   */
  const loadTeacherExams = async () => {
    try {
      setLoading(true);
      setError(null);

      const exams = await getAllExams();
      // Sadece öğretmenin derslerine ait sınavları filtrele
      const teacherExams = exams.filter(
        exam => exam.course?.teacher?.id === user.id
      );
      setAllExams(teacherExams);
      
    } catch (err) {
      console.error('Sınavlar yüklenirken hata:', err);
      setError('Sınavlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sınava katıl
   */
  const handleJoinExam = (examId) => {
    navigate(`/exam/${examId}`);
  };

  /**
   * Sınav oluşturma sayfasına git
   */
  const handleCreateExam = () => {
    navigate('/exam/create');
  };

  /**
   * Sınav sonuçlarını görüntüle (öğretmen için)
   */
  const handleViewResults = async (examId) => {
    try {
      const results = await getResultsByExam(examId);
      setSelectedExamResults(results);
      setShowResultsModal(true);
    } catch (err) {
      console.error('Sonuçlar yüklenirken hata:', err);
      alert('Sonuçlar yüklenemedi.');
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

  /**
   * Tarihi formatla
   */
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading
  if (loading) {
    return (
      <div className="layout">
        <Sidebar onNavigate={handleNavigate} onLogout={handleLogout} currentPage="exams" />
        <main className="main-area">
          <Topbar user={user} onLogout={handleLogout} />
          <div className="exams-loading">
            <div className="spinner"></div>
            <p>Sınavlar yükleniyor...</p>
          </div>
        </main>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="layout">
        <Sidebar onNavigate={handleNavigate} onLogout={handleLogout} currentPage="exams" />
        <main className="main-area">
          <Topbar user={user} onLogout={handleLogout} />
          <div className="exams-error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Tekrar Dene</button>
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

        <section className="exams-section">
          {/* Header */}
          <div className="exams-header">
            <div className="exams-header-left">
              <h1 className="page-title">📝 Sınavlar</h1>
              <p className="page-subtitle">
                {isTeacher 
                  ? 'Sınavlarınızı yönetin ve sonuçları görüntüleyin'
                  : 'Aktif sınavlara katılın ve sonuçlarınızı görün'
                }
              </p>
            </div>
            
            {/* Sınav Oluştur Butonu - Sadece öğretmenler için */}
            {isTeacher && (
              <button className="btn-create-exam" onClick={handleCreateExam}>
                <span className="btn-icon">➕</span>
                Yeni Sınav Oluştur
              </button>
            )}
          </div>

          {/* Öğrenci Görünümü */}
          {!isTeacher && (
            <>
              {/* Tab Navigation */}
              <div className="exams-tabs">
                <button 
                  className={`tab-btn ${activeTab === 'available' ? 'active' : ''}`}
                  onClick={() => setActiveTab('available')}
                >
                  <span className="tab-icon">📋</span>
                  Aktif Sınavlar
                  <span className="tab-count">{availableExams.length}</span>
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
                  onClick={() => setActiveTab('completed')}
                >
                  <span className="tab-icon">✅</span>
                  Tamamlanan Sınavlar
                  <span className="tab-count">{completedExams.length}</span>
                </button>
              </div>

              {/* Aktif Sınavlar */}
              {activeTab === 'available' && (
                <div className="exams-grid">
                  {availableExams.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📭</div>
                      <h3>Aktif sınav bulunmuyor</h3>
                      <p>Şu anda girebileceğiniz bir sınav yok.</p>
                    </div>
                  ) : (
                    availableExams.map(exam => (
                      <div key={exam.id} className="exam-card available">
                        <div className="exam-card-header">
                          <span className="exam-status-badge available">Aktif</span>
                          <span className="exam-duration">⏱️ {exam.durationMinutes} dk</span>
                        </div>
                        
                        <h3 className="exam-title">{exam.title}</h3>
                        <p className="exam-course">{exam.course?.name || 'Ders bilgisi yok'}</p>
                        
                        {exam.description && (
                          <p className="exam-description">{exam.description}</p>
                        )}
                        
                        <div className="exam-card-footer">
                          <span className="exam-created">
                            📅 {formatDate(exam.createdAt)}
                          </span>
                          <button 
                            className="btn-join-exam"
                            onClick={() => handleJoinExam(exam.id)}
                          >
                            Sınava Gir
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Tamamlanan Sınavlar */}
              {activeTab === 'completed' && (
                <div className="exams-grid">
                  {completedExams.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">📊</div>
                      <h3>Henüz sınav tamamlamadınız</h3>
                      <p>Tamamladığınız sınavların sonuçları burada görünecek.</p>
                    </div>
                  ) : (
                    completedExams.map(result => (
                      <div key={result.id} className="exam-card completed">
                        <div className="exam-card-header">
                          <span className="exam-status-badge completed">Tamamlandı</span>
                          <span className={`exam-score ${result.score >= 50 ? 'pass' : 'fail'}`}>
                            {parseFloat(result.score).toFixed(1)} Puan
                          </span>
                        </div>
                        
                        <h3 className="exam-title">{result.exam?.title || result.examTitle}</h3>
                        <p className="exam-course">
                          {result.exam?.course?.name || result.courseName || 'Ders bilgisi yok'}
                        </p>
                        
                        <div className="exam-stats">
                          <div className="stat-item">
                            <span className="stat-label">Doğru</span>
                            <span className="stat-value correct">{result.correctAnswers || '-'}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Yanlış</span>
                            <span className="stat-value wrong">{result.wrongAnswers || '-'}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Boş</span>
                            <span className="stat-value empty">{result.emptyAnswers || '-'}</span>
                          </div>
                        </div>
                        
                        <div className="exam-card-footer">
                          <span className="exam-completed-date">
                            📅 {formatDate(result.finishedAt)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}

          {/* Öğretmen Görünümü */}
          {isTeacher && (
            <div className="teacher-exams">
              {allExams.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>Henüz sınav oluşturmadınız</h3>
                  <p>Yeni bir sınav oluşturmak için yukarıdaki butonu kullanın.</p>
                </div>
              ) : (
                <div className="exams-table-wrapper">
                  <table className="exams-table">
                    <thead>
                      <tr>
                        <th>Sınav Adı</th>
                        <th>Ders</th>
                        <th>Süre</th>
                        <th>Oluşturulma</th>
                        <th>Katılımcı</th>
                        <th>İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allExams.map(exam => (
                        <tr key={exam.id}>
                          <td className="exam-name-cell">
                            <strong>{exam.title}</strong>
                            {exam.description && (
                              <span className="exam-desc-preview">{exam.description}</span>
                            )}
                          </td>
                          <td>{exam.course?.name || '-'}</td>
                          <td>{exam.durationMinutes} dk</td>
                          <td>{formatDate(exam.createdAt)}</td>
                          <td>
                            <span className="participant-count">
                              {exam.participantCount || 0} öğrenci
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button 
                                className="btn-view-results"
                                onClick={() => handleViewResults(exam.id)}
                              >
                                📊 Sonuçlar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Sonuçlar Modal - Öğretmen için */}
        {showResultsModal && selectedExamResults && (
          <div className="modal-overlay" onClick={() => setShowResultsModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>📊 Sınav Sonuçları</h2>
                <button className="modal-close" onClick={() => setShowResultsModal(false)}>✕</button>
              </div>
              
              <div className="modal-body">
                {selectedExamResults.length === 0 ? (
                  <div className="empty-state">
                    <p>Henüz bu sınava giren öğrenci yok.</p>
                  </div>
                ) : (
                  <>
                    {/* İstatistikler */}
                    <div className="results-stats">
                      <div className="result-stat-card">
                        <span className="stat-label">Toplam Katılımcı</span>
                        <span className="stat-value">{selectedExamResults.length}</span>
                      </div>
                      <div className="result-stat-card">
                        <span className="stat-label">Ortalama Puan</span>
                        <span className="stat-value">
                          {(selectedExamResults.reduce((sum, r) => sum + parseFloat(r.score), 0) / selectedExamResults.length).toFixed(1)}
                        </span>
                      </div>
                      <div className="result-stat-card">
                        <span className="stat-label">Başarı Oranı</span>
                        <span className="stat-value">
                          {((selectedExamResults.filter(r => parseFloat(r.score) >= 50).length / selectedExamResults.length) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Sonuç Tablosu */}
                    <table className="results-table">
                      <thead>
                        <tr>
                          <th>Öğrenci</th>
                          <th>Puan</th>
                          <th>Doğru</th>
                          <th>Yanlış</th>
                          <th>Boş</th>
                          <th>Tarih</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedExamResults.map(result => (
                          <tr key={result.id}>
                            <td>{result.student?.nameSurname || result.studentName || '-'}</td>
                            <td>
                              <span className={`score-badge ${parseFloat(result.score) >= 50 ? 'pass' : 'fail'}`}>
                                {parseFloat(result.score).toFixed(1)}
                              </span>
                            </td>
                            <td className="correct">{result.correctAnswers || '-'}</td>
                            <td className="wrong">{result.wrongAnswers || '-'}</td>
                            <td>{result.emptyAnswers || '-'}</td>
                            <td>{formatDate(result.finishedAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ExamsPage;
