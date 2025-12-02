// src/api/users.js
import apiClient from "./client";

export async function getAllCourses() {
    const response = await apiClient.get("/courses");
    return response.data;
}

export async function getCourseById(id) {
    const response = await apiClient.get(`/courses/${id}`);
    return response;
}

export async function createCourse(userData) {
  const response = await apiClient.post("/courses/add", userData);
  return response.data;
}

export async function updateCourse(userData) {
  const response = await apiClient.post("/courses/update", userData);
  return response.data;
}

export async function deleteCourse(userData) {
  const response = await apiClient.post("/courses/delete", userData);
  return response.data;
}