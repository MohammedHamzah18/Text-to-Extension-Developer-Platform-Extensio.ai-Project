import api from './api';

export const getStats = () => api.get('/admin/stats');
export const listUsers = () => api.get('/admin/users');
export const listAllExtensions = () => api.get('/admin/extensions');
export const listAllDownloads = () => api.get('/admin/downloads');
export const deleteExtensionAdmin = (id) => api.delete(`/admin/extensions/${id}`);
export const flagExtension = (id) => api.patch(`/admin/extensions/${id}/flag`);
