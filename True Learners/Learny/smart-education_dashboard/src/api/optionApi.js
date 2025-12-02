// src/api/users.js
import apiClient from "./client";

export async function getAllOptions() {
    const response = await apiClient.get("/options");
    return response.data;
}

export async function getOptionById(id) {
    const response = await apiClient.get(`/options/${id}`);
    return response;
}

export async function createOption(userData) {
  const response = await apiClient.post("/options/add", userData);
  return response.data;
}

export async function updateOption(userData) {
  const response = await apiClient.post("/options/update", userData);
  return response.data;
}

export async function deleteOption(userData) {
  const response = await apiClient.post("/options/delete", userData);
  return response.data;
}