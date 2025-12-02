// src/api/users.js
import apiClient from "./client";

export async function getAllQuestions() {
    const response = await apiClient.get("/questions");
    return response.data;
}

export async function getQuestionById(id) {
    const response = await apiClient.get(`/questions/${id}`);
    return response;
}

export async function createQuestion(userData) {
  const response = await apiClient.post("/questions/add", userData);
  return response.data;
}

export async function updateQuestion(userData) {
  const response = await apiClient.post("/questions/update", userData);
  return response.data;
}

export async function deleteQuestion(userData) {
  const response = await apiClient.post("/questions/delete", userData);
  return response.data;
}