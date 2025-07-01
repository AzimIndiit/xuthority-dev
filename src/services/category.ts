import api from './api';

export const fetchSoftwareCategories = async (page = 1, limit = 12) => {
  const res = await api.get('/software', { params: { page, limit } });
  return {
    data: res.data.data,
    pagination: res.data.meta?.pagination || {},
  };
};

export const fetchSolutionCategories = async (page = 1, limit = 12) => {
  const res = await api.get('/solutions', { params: { page, limit } });
  return {
    data: res.data.data,
    pagination: res.data.meta?.pagination || {},
  };
}; 