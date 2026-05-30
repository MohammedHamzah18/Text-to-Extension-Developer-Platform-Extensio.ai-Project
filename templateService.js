import api from './api';

export const listTemplates = (category) =>
  api.get('/templates', { params: category ? { category } : {} });
export const getTemplate = (id) => api.get(`/templates/${id}`);
