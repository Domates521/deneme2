// src/api/users.js
import apiClient from "./client";

export async function getAllResults() {
    const response = await apiClient.get("/results");
    return response.data;
}

export async function getResultById(id) {
    const response = await apiClient.get(`/results/${id}`);
    return response;
}

export async function createResult(userData) {
  const response = await apiClient.post("/results/add", userData);
  return response.data;
}

export async function updateResult(userData) {
  const response = await apiClient.post("/results/update", userData);
  return response.data;
}

export async function deleteResult(userData) {
  const response = await apiClient.post("/results/delete", userData);
  return response.data;
}