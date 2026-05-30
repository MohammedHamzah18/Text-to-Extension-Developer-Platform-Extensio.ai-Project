import api from './api';

export const listExtensions = (params) => api.get('/extensions', { params });
export const getExtension = (id) => api.get(`/extensions/${id}`);
export const createExtension = (data) => api.post('/extensions', data);
export const updateExtension = (id, data) => api.put(`/extensions/${id}`, data);
export const deleteExtension = (id) => api.delete(`/extensions/${id}`);
export const previewExtension = (id) => api.get(`/extensions/${id}/preview`);
export const generateExtension = (id) => api.post(`/extensions/${id}/generate`);
export const cloneExtension = (id) => api.post(`/extensions/${id}/clone`);
export const saveVersion = (id, label) => api.post(`/extensions/${id}/versions`, { label });
export const restoreVersion = (id, versionId) =>
  api.post(`/extensions/${id}/versions/${versionId}/restore`);
export const compareVersions = (id, v1, v2) =>
  api.get(`/extensions/${id}/versions/compare`, { params: { v1, v2 } });
