import api from "./axios";

// export const getRecommendations = () => {
//   return api.get("/recommendations");
// };

export const generateAIReview = (data) => {
  return api.post("/ai-review", data);
};

export const getTimeEstimate = (contentId) => {
return api.get(`/content/time-estimate/${contentId}`);
};
