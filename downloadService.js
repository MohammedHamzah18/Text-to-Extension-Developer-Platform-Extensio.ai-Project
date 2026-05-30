import api from './api';

export const getDownloads = () => api.get('/downloads');
export const recordDownload = (extensionId) => api.post(`/downloads/${extensionId}`);
