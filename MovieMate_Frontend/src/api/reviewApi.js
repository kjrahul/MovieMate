import axios from "axios";

const API = "http://localhost:8000/reviews"; // adjust port if needed

export const getReviews = (contentId) => {
  return axios.get(`${API}/${contentId}`);
};

export const addReview = (contentId, data) => {
  return axios.post(`${API}/${contentId}`, data);
};

export const updateReview = (reviewId, data) => {
  return axios.put(`${API}/${reviewId}`, data);
};

export const deleteReview = (reviewId) => {
  return axios.delete(`${API}/${reviewId}`);
};
