// src/api/courseApi.js
import apiClient from "./client";

/**
 * COURSE API CLIENT
 * 
 * Ders işlemleri için backend endpoint'lerine istek gönderir
 */

/**
 * Tüm dersleri getir
 */
export async function getAllCourses() {
    const response = await apiClient.get("/courses");
    return response.data;
}

/**
 * ID'ye göre ders getir
 */
export async function getCourseById(id) {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
}

/**
 * Öğretmene göre dersleri getir
 * 
 * @param {number} teacherId - Öğretmen ID
 * @returns {Promise<Array>} - Öğretmenin tüm dersleri
 */
export async function getCoursesByTeacher(teacherId) {
    const response = await apiClient.get(`/courses/teacher/${teacherId}`);
    return response.data;
}

/**
 * Yeni ders oluştur
 */
export async function createCourse(courseData) {
    const response = await apiClient.post("/courses/add", courseData);
    return response.data;
}

/**
 * Ders güncelle
 */
export async function updateCourse(id, courseData) {
    const response = await apiClient.post(`/courses/update/${id}`, courseData);
    return response.data;
}

/**
 * Ders sil
 */
export async function deleteCourse(id) {
    const response = await apiClient.post(`/courses/delete/${id}`);
    return response.data;
}
