// src/pages/CoursesPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { getEnrollmentsByStudent } from '../api/enrollmentApi';
import './CoursesPage.css';

/**
 * COURSES PAGE - MEVCUT DATABASE YAPISINA UYUMLU
 * 
 * Backend'den Gelen Veri Yapısı (Enrollment):
 * {
 *   id: 1,
 *   student: { id, userName, nameSurname, mail, role },
 *   course: {
 *     id: 1,
 *     code: "CS101",           // Derskodu
 *     name: "Spring Boot",     // Dersadi
 *     teacher: {               // Dersogretmenid
 *       id, userName, nameSurname, mail, role
 *     }
 *   }
 * }
 */

const CoursesPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openCourseId, setOpenCourseId] = useState(null);

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!user || !user.id) {
          setError('Kullanıcı bilgisi bulunamadı. Lütfen tekrar giriş yapın.');
          return;
        }

        console.log('🔍 Fetching courses for user ID:', user.id);

        const enrollments = await getEnrollmentsByStudent(user.id);
        
        console.log('📦 Backend Response:', enrollments);
        console.log('📊 Total enrollments:', enrollments?.length || 0);
        
        // Her enrollment'ı detaylı logla
        if (enrollments && enrollments.length > 0) {
          enrollments.forEach((enrollment, index) => {
            console.log(`📚 Enrollment ${index + 1}:`, {
              enrollmentId: enrollment.id,
              courseId: enrollment.course?.id,
              courseName: enrollment.course?.name,
              courseCode: enrollment.course?.code,
              teacherName: enrollment.course?.teacher?.nameSurname,
              teacherEmail: enrollment.course?.teacher?.mail,
            });
          });
        }
        
        setCourses(enrollments || []);
        
      } catch (err) {
        console.error('❌ Dersler yüklenirken hata:', err);
        console.error('❌ Error details:', err.response?.data || err.message);
        setError('Dersler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserCourses();
  }, [user]);

  const toggleCourse = (courseId) => {
    setOpenCourseId((prev) => (prev === courseId ? null : courseId));
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

  if (loading) {
    return (
      <div className="layout">
        <Sidebar 
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          currentPage="courses"
        />
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
        <Sidebar 
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          currentPage="courses"
        />
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
            // Backend'den gelen course objesi
            const course = enrollment?.course;
            
            // Course yoksa bu enrollment'ı atlayalım
            if (!course) {
              console.warn('⚠️ Course bilgisi yok:', enrollment);
              return null;
            }
            
            const isOpen = openCourseId === course.id;

            // Backend fieldlarından verileri çekiyoruz
            // course.name = Dersadi (database'de)
            // course.code = Derskodu (database'de)
            // course.teacher = User objesi (Kullanicilar tablosundan)
            
            const courseName = course.name || 'İsimsiz Ders';
            const courseCode = course.code || '-';
            const teacher = course.teacher;
            const teacherName = teacher?.nameSurname || 'Belirtilmemiş';
            const teacherEmail = teacher?.mail || '-';
            const teacherUsername = teacher?.userName || '-';

            return (
              <article 
                key={enrollment.id} 
                className={`course-card ${isOpen ? 'open' : ''}`}
              >
                <header className="course-header">
                  <div className="course-main-info">
                    <div className="course-icon">
                      {courseName.charAt(0).toUpperCase()}
                    </div>
                    <div className="course-title-area">
                      <h2 className="course-title">{courseName}</h2>
                      <p className="course-subtitle">
                        {courseCode} • {teacherName}
                      </p>
                    </div>
                  </div>

                  <div className="course-badge-row">
                    <div className="course-badge badge-ongoing">
                      📖 Aktif
                    </div>
                  </div>

                  <button
                    className="course-toggle-btn"
                    type="button"
                    onClick={() => toggleCourse(course.id)}
                  >
                    <span>Detaylar</span>
                    <svg
                      className="chevron"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </header>

                {isOpen && (
                  <section className="course-details">
                    <div className="details-grid">
                      
                      {/* DERS BİLGİLERİ */}
                      <div className="detail-box" style={{ gridColumn: '1 / -1' }}>
                        <div className="detail-head">
                          <span>📋 Ders Bilgileri</span>
                        </div>
                        <div className="info-list">
                          <div className="info-row">
                            <div className="info-row-label">Ders Adı</div>
                            <div className="info-row-value">{courseName}</div>
                          </div>
                          <div className="info-row">
                            <div className="info-row-label">Ders Kodu</div>
                            <div className="info-row-value">{courseCode}</div>
                          </div>
                          <div className="info-row">
                            <div className="info-row-label">Eğitmen</div>
                            <div className="info-row-value">{teacherName}</div>
                          </div>
                          <div className="info-row">
                            <div className="info-row-label">Eğitmen Email</div>
                            <div className="info-row-value">
                              <a 
                                href={`mailto:${teacherEmail}`}
                                style={{ 
                                  color: '#5d3bea', 
                                  textDecoration: 'none' 
                                }}
                              >
                                {teacherEmail}
                              </a>
                            </div>
                          </div>
                          <div className="info-row">
                            <div className="info-row-label">Eğitmen Kullanıcı Adı</div>
                            <div className="info-row-value">{teacherUsername}</div>
                          </div>
                          <div className="info-row">
                            <div className="info-row-label">Kayıt ID</div>
                            <div className="info-row-value">#{enrollment.id}</div>
                          </div>
                        </div>
                      </div>

                      {/* SINAV BİLGİSİ */}
                      <div className="detail-box" style={{ gridColumn: '1 / -1' }}>
                        <div className="detail-head">
                          <span>📝 Sınavlar</span>
                        </div>
                        <div style={{ padding: '1.5rem', textAlign: 'center', color: '#6b6b84' }}>
                          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📊</div>
                          <p style={{ margin: '0.5rem 0', fontWeight: '600' }}>
                            Sınav bilgileri için ayrı bir sistem geliştirilecek
                          </p>
                          <p style={{ fontSize: '0.9rem', margin: '0' }}>
                            Sınavlara "Sınavlar" menüsünden erişebilirsiniz
                          </p>
                        </div>
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