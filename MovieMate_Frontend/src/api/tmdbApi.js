import api from "./axios";

export const searchTMDB = (title, contentType) => {
  return api.get("/tmdb/search", {
    params: {
      title,
      content_type: contentType,
    },
  });
};

export const getTMDBDetails = (tmdbId, contentType) => {
  return api.get(`/tmdb/details/${tmdbId}`, {
    params: {
      content_type: contentType,
    },
  });
};
