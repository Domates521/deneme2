// src/api/examResultApi.js
import apiClient from "./client";

/**
 * EXAM RESULT API CLIENT
 * 
 * Sınav sonuçları için backend endpoint'lerine istek gönderir
 * 
 * ENDPOINT'LER:
 * - getAllResults: Tüm sonuçları getir
 * - getResultById: ID'ye göre sonuç getir
 * - getResultsByStudent: Öğrenciye göre sonuçları getir
 * - getResultsByExam: Sınava göre sonuçları getir
 */

/**
 * Tüm sonuçları getir
 */
export async function getAllResults() {
    const response = await apiClient.get("/results");
    return response.data;
}

/**
 * ID'ye göre sonuç getir
 */
export async function getResultById(id) {
    const response = await apiClient.get(`/results/${id}`);
    return response.data;
}

/**
 * Öğrenciye göre sonuçları getir
 * 
 * @param {number} studentId - Öğrenci ID
 * @returns {Promise<Array>} - Öğrencinin tüm sınav sonuçları
 */
export async function getResultsByStudent(studentId) {
    const response = await apiClient.get(`/results/student/${studentId}`);
    return response.data;
}

/**
 * Sınava göre sonuçları getir
 * 
 * @param {number} examId - Sınav ID
 * @returns {Promise<Array>} - Sınava giren tüm öğrencilerin sonuçları
 */
export async function getResultsByExam(examId) {
    const response = await apiClient.get(`/results/exam/${examId}`);
    return response.data;
}

/**
 * Yeni sonuç oluştur
 */
export async function createResult(resultData) {
    const response = await apiClient.post("/results/add", resultData);
    return response.data;
}

/**
 * Sonuç güncelle
 */
export async function updateResult(id, resultData) {
    const response = await apiClient.post(`/results/update/${id}`, resultData);
    return response.data;
}

/**
 * Sonuç sil
 */
export async function deleteResult(id) {
    const response = await apiClient.post(`/results/delete/${id}`);
    return response.data;
}
