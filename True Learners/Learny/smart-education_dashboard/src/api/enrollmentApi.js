// src/api/enrollmentApi.js
import apiClient from "./client";

export async function getAllEnrollments() {
    const response = await apiClient.get("/enrollments");
    return response.data;
}

export async function getEnrollmentById(id) {
    const response = await apiClient.get(`/enrollments/${id}`);
    return response;
}

/**
 * Öğrencinin kayıtlı olduğu tüm dersleri getirir
 * @param {number} studentId - Öğrenci ID'si
 * @returns {Promise} - Enrollment listesi
 */
export async function getEnrollmentsByStudent(studentId) {
    const response = await apiClient.get(`/enrollments/student/${studentId}`);
    return response.data;
}

/**
 * Dersin tüm kayıtlarını getirir
 * @param {number} courseId - Ders ID'si
 * @returns {Promise} - Enrollment listesi
 */
export async function getEnrollmentsByCourse(courseId) {
    const response = await apiClient.get(`/enrollments/course/${courseId}`);
    return response.data;
}

export async function createEnrollment(userData) {
  const response = await apiClient.post("/enrollments/add", userData);
  return response.data;
}

export async function updateEnrollment(userData) {
  const response = await apiClient.post("/enrollments/update", userData);
  return response.data;
}

export async function deleteEnrollment(userData) {
  const response = await apiClient.post("/enrollments/delete", userData);
  return response.data;
}