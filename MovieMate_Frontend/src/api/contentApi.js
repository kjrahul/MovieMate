import api from "./axios";

export const getAllContent = (filters = {}) => {
  return api.get("/content", { params: filters });
};

export const getContentById = (id) => {
  return api.get(`/content/${id}`);
};

export const createContent = (data) => {
  return api.post("/content", data);
};

export const updateContent = (id, data) => {
  return api.put(`/content/${id}`, data);
};

export const deleteContent = (id) => {
  return api.delete(`/content/${id}`);
};


