// src/pages/CoursesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { getEnrollmentsByStudent } from '../api/enrollmentApi';
import { getExamsByCourse } from '../api/examApi';
import { getResultsByStudent, getResultsByExam } from '../api/examResultApi';
import './CoursesPage.css';

/**
 * COURSES PAGE - MEVCUT DATABASE YAPISINA UYUMLU
 * 
 * ÖZELLİKLER:
 * - Öğrenci: Kayıtlı dersleri ve sınav sonuçlarını görür
 * - Öğretmen: Dersleri ve sınav detaylarını (katılımcılar, notlar) görür
 */

const CoursesPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCourseId, setOpenCourseId] = useState(null);
  
  // Sınav verileri
  const [courseExams, setCourseExams] = useState({}); // { courseId: [exams] }
  const [studentResults, setStudentResults] = useState([]); // Öğrencinin tüm sonuçları
  const [examResults, setExamResults] = useState({}); // { examId: [results] } - Öğretmen için
  const [loadingExams, setLoadingExams] = useState({});

  const isTeacher = user?.role === 'Ogretmen';

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user || !user.id) {
          setError('Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
          return;
        }

        const enrollments = await getEnrollmentsByStudent(user.id);
        setCourses(enrollments || []);

        // Öğrenci ise sonuçlarını da al
        if (!isTeacher) {
          const results = await getResultsByStudent(user.id);
          setStudentResults(results || []);
        }
        
      } catch (err) {
        console.error('Dersler yüklenirken hata:', err);
        setError('Dersler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserCourses();
  }, [user, isTeacher]);

  const toggleCourse = async (courseId) => {
    if (openCourseId === courseId) {
      setOpenCourseId(null);
      return;
    }
    
    setOpenCourseId(courseId);
    
    // Sınavları yükle (eğer henüz yüklenmemişse)
    if (!courseExams[courseId]) {
      await loadCourseExams(courseId);
    }
  };

  const loadCourseExams = async (courseId) => {
    try {
      setLoadingExams(prev => ({ ...prev, [courseId]: true }));
      
      const exams = await getExamsByCourse(courseId);
      setCourseExams(prev => ({ ...prev, [courseId]: exams }));
      
      // Öğretmen için sınav sonuçlarını da yükle
      if (isTeacher && exams.length > 0) {
        for (const exam of exams) {
          const results = await getResultsByExam(exam.id);
          setExamResults(prev => ({ ...prev, [exam.id]: results }));
        }
      }
      
    } catch (err) {
      console.error('Sınavlar yüklenirken hata:', err);
    } finally {
      setLoadingExams(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const joinExam = (examId) => {
    navigate(`/exam/${examId}`);
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

  // Öğrencinin bir sınavdaki sonucunu bul
  const getStudentExamResult = (examId) => {
    return studentResults.find(r => (r.exam?.id || r.examId) === examId);
  };

  // Tarihi formatla
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="layout">
        <Sidebar onNavigate={handleNavigate} onLogout={handleLogout} currentPage="courses" />
        <main className="main-area">
          <Topbar user={user} onLogout={handleLogout} />
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '60vh',
            fontSize: '1.2rem',
            color: '#6b6b84'
          }}>
            Dersler yükleniyor...
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="layout">
        <Sidebar onNavigate={handleNavigate} onLogout={handleLogout} currentPage="courses" />
        <main className="main-area">
          <Topbar user={user} onLogout={handleLogout} />
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '60vh',
            fontSize: '1.2rem',
            color: '#e74c3c',
            gap: '1rem',
            padding: '2rem'
          }}>
            <div style={{ textAlign: 'center' }}>{error}</div>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: '#5b72ee',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              Tekrar Dene
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="layout">
      <Sidebar 
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        currentPage="courses"
      />

      <main className="main-area">
        <Topbar user={user} onLogout={handleLogout} />

        <section className="courses-section">
          <div className="courses-header">
            <h1 className="page-title">Derslerim</h1>
            <div className="courses-count">
              <strong>{courses.length}</strong> aktif ders
            </div>
          </div>

          {courses.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#6b6b84'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📚</div>
              <h3>Henüz kayıtlı olduğunuz bir ders yok</h3>
              <p>Derslere kayıt olmak için yöneticinize başvurun.</p>
            </div>
          )}

          {courses.map((enrollment) => {
            const course = enrollment?.course;
            if (!course) return null;
            
            const isOpen = openCourseId === course.id;
            const courseName = course.name || 'İsimsiz Ders';
            const courseCode = course.code || '-';
            const teacher = course.teacher;
            const teacherName = teacher?.nameSurname || 'Belirtilmemiş';
            const exams = courseExams[course.id] || [];
            const isLoadingExams = loadingExams[course.id];

            return (
              <article 
                key={enrollment.id} 
                className={`course-card ${isOpen ? 'open' : ''}`}
              >
                {/* Kart Üst Kısmı */}
                <div className="course-top">
                  <div className="course-thumb">
                    <span>{courseCode.substring(0, 2)}</span>
                  </div>

                  <div className="course-info">
                    <div className="course-title">{courseName}</div>
                    <div className="course-meta">
                      <span className="meta-item">
                        <span className="icon">📚</span> {courseCode}
                      </span>
                      <span className="meta-item">
                        <span className="icon">👤</span> {teacherName}
                      </span>
                    </div>
                  </div>

                  <button
                    className="course-toggle-btn"
                    onClick={() => toggleCourse(course.id)}
                  >
                    <span>{isOpen ? 'Kapat' : 'Detaylar'}</span>
                    <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>

                {/* Detaylar */}
                {isOpen && (
                  <section className="course-details">
                    <div className="details-grid">
                      {/* Ders Bilgileri */}
                      <div className="detail-box">
                        <div className="detail-head">
                          <span>📋 Ders Bilgileri</span>
                        </div>
                        <div className="info-list">
                          <div className="info-row">
                            <div className="info-row-label">Ders Kodu</div>
                            <div className="info-row-value">{courseCode}</div>
                          </div>
                          <div className="info-row">
                            <div className="info-row-label">Ders Adı</div>
                            <div className="info-row-value">{courseName}</div>
                          </div>
                          <div className="info-row">
                            <div className="info-row-label">Eğitmen</div>
                            <div className="info-row-value">{teacherName}</div>
                          </div>
                          <div className="info-row">
                            <div className="info-row-label">E-posta</div>
                            <div className="info-row-value">{teacher?.mail || '-'}</div>
                          </div>
                        </div>
                      </div>

                      {/* Sınavlar */}
                      <div className="detail-box" style={{ gridColumn: '1 / -1' }}>
                        <div className="detail-head">
                          <span>📝 Sınavlar</span>
                          {exams.length > 0 && (
                            <span className="small-pill">{exams.length} sınav</span>
                          )}
                        </div>
                        
                        {isLoadingExams ? (
                          <div style={{ padding: '1rem', textAlign: 'center', color: '#6b6b84' }}>
                            Sınavlar yükleniyor...
                          </div>
                        ) : exams.length === 0 ? (
                          <div style={{ padding: '1.5rem', textAlign: 'center', color: '#6b6b84' }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                            <p style={{ margin: 0 }}>Bu derse ait sınav bulunmuyor.</p>
                          </div>
                        ) : (
                          <div className="exams-list">
                            {exams.map(exam => {
                              const result = getStudentExamResult(exam.id);
                              const hasCompleted = !!result;
                              const examResultsData = examResults[exam.id] || [];
                              
                              return (
                                <div key={exam.id} className="exam-item">
                                  <div className="exam-item-info">
                                    <div className="exam-item-title">{exam.title}</div>
                                    <div className="exam-item-meta">
                                      <span>⏱️ {exam.durationMinutes} dk</span>
                                      <span>📅 {formatDate(exam.createdAt)}</span>
                                    </div>
                                  </div>
                                  
                                  <div className="exam-item-status">
                                    {!isTeacher ? (
                                      // Öğrenci görünümü
                                      hasCompleted ? (
                                        <div className="exam-completed">
                                          <span className={`score ${parseFloat(result.score) >= 50 ? 'pass' : 'fail'}`}>
                                            {parseFloat(result.score).toFixed(1)} Puan
                                          </span>
                                          <span className="completed-label">Tamamlandı</span>
                                        </div>
                                      ) : (
                                        <button 
                                          className="btn-join-exam"
                                          onClick={() => joinExam(exam.id)}
                                        >
                                          Sınava Gir
                                        </button>
                                      )
                                    ) : (
                                      // Öğretmen görünümü
                                      <div className="exam-teacher-stats">
                                        <span className="participant-count">
                                          {examResultsData.length} katılımcı
                                        </span>
                                        {examResultsData.length > 0 && (
                                          <span className="avg-score">
                                            Ort: {(examResultsData.reduce((sum, r) => sum + parseFloat(r.score), 0) / examResultsData.length).toFixed(1)}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                )}
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
};

export default CoursesPage;
