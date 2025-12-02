// src/api/examApi.js
import apiClient from "./client";

/**
 * EXAM API CLIENT
 * 
 * Sınav işlemleri için backend endpoint'lerine istek gönderir
 * 
 * ENDPOINT'LER:
 * - getAllExams: Tüm sınavları getir
 * - getExamById: ID'ye göre sınav getir
 * - getExamsByCourse: Derse göre sınavları getir
 * - getExamFull: Sınav detayları (sorular + seçenekler)
 * - submitExam: Sınav cevaplarını gönder ve puanla
 * - createExam: Yeni sınav oluştur (öğretmen)
 */

/**
 * Tüm sınavları getir
 * 
 * KULLANIM: Sınav listesi sayfasında
 */
export async function getAllExams() {
  const response = await apiClient.get("/exams");
  return response.data;
}

/**
 * ID'ye göre sınav getir
 * 
 * KULLANIM: Sınav temel bilgilerini görüntüleme
 */
export async function getExamById(id) {
  const response = await apiClient.get(`/exams/${id}`);
  return response.data;
}

/**
 * Derse göre sınavları getir
 * 
 * KULLANIM: Ders sayfasında o dersin sınavlarını listeleme
 */
export async function getExamsByCourse(courseId) {
  const response = await apiClient.get(`/exams/course/${courseId}`);
  return response.data;
}

/**
 * Sınav detaylarını sorular ve seçeneklerle birlikte getir
 * 
 * KULLANIM: Öğrenci sınava başladığında
 * 
 * RESPONSE:
 * {
 *   examId: 1,
 *   title: "Matematik Ara Sınav",
 *   durationMinutes: 60,
 *   questions: [
 *     {
 *       questionId: 1,
 *       text: "2 + 2 = ?",
 *       type: "CoktanSecmeli",
 *       options: [
 *         { optionId: 1, text: "3" },
 *         { optionId: 2, text: "4" }
 *       ]
 *     }
 *   ]
 * }
 */
export async function getExamFull(examId) {
  const response = await apiClient.get(`/exams/${examId}/full`);
  return response.data;
}

/**
 * Sınav cevaplarını gönder ve puanla
 * 
 * KULLANIM: Öğrenci sınavı bitirdiğinde
 * 
 * @param {Object} examSubmission - Sınav cevapları
 * @param {number} examSubmission.examId - Sınav ID
 * @param {number} examSubmission.studentId - Öğrenci ID
 * @param {Array} examSubmission.answers - Cevaplar
 * 
 * REQUEST:
 * {
 *   examId: 1,
 *   studentId: 6,
 *   answers: [
 *     { questionId: 1, selectedOptionIds: [2] },
 *     { questionId: 2, selectedOptionIds: [5] }
 *   ]
 * }
 * 
 * RESPONSE:
 * {
 *   score: 85.50,
 *   totalQuestions: 10,
 *   correctAnswers: 8,
 *   wrongAnswers: 2,
 *   questionResults: [...]
 * }
 */
export async function submitExam(examSubmission) {
  const response = await apiClient.post("/exams/submit", examSubmission);
  return response.data;
}

/**
 * Yeni sınav oluştur (sorular ve seçenekler dahil)
 * 
 * KULLANIM: Öğretmen yeni sınav eklerken
 * 
 * @param {Object} examData - Sınav bilgileri
 * @param {string} examData.title - Sınav başlığı
 * @param {string} examData.description - Sınav açıklaması
 * @param {number} examData.durationMinutes - Süre (dakika)
 * @param {number} examData.courseId - Ders ID
 * @param {Array} examData.questions - Sorular
 * 
 * REQUEST:
 * {
 *   title: "Matematik Ara Sınav",
 *   description: "Birinci dönem ara sınav",
 *   durationMinutes: 60,
 *   courseId: 1,
 *   questions: [
 *     {
 *       text: "2 + 2 = ?",
 *       type: "CoktanSecmeli",
 *       options: [
 *         { text: "3", isCorrect: false },
 *         { text: "4", isCorrect: true }
 *       ]
 *     }
 *   ]
 * }
 * 
 * RESPONSE:
 * {
 *   examId: 15,
 *   message: "Sınav başarıyla oluşturuldu"
 * }
 */
export async function createExam(examData) {
  const response = await apiClient.post("/exams/create", examData);
  return response.data;
}

/**
 * Sınav güncelle
 * 
 * KULLANIM: Öğretmen sınavı düzenlerken
 */
export async function updateExam(id, examData) {
  const response = await apiClient.post(`/exams/update/${id}`, examData);
  return response.data;
}

/**
 * Sınav sil
 * 
 * KULLANIM: Öğretmen sınavı silerken
 */
export async function deleteExam(id) {
  const response = await apiClient.post(`/exams/delete/${id}`);
  return response.data;
}