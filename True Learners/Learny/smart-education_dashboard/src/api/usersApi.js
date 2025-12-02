// src/api/users.js
import apiClient from "./client";

export async function getAllUsers() {
    const response = await apiClient.get("/users");
    return response.data;
}

export async function getUserById(id) {
    const response = await apiClient.get(`/users/${id}`);
    return response;
}

export async function createUser(userData) {
  const response = await apiClient.post("/users/add", userData);
  return response.data;
}

export async function updateUser(userData) {
  const response = await apiClient.post("/users/update", userData);
  return response.data;
}

export async function deleteUser(userData) {
  const response = await apiClient.post("/users/delete", userData);
  return response.data;
}