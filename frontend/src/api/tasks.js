import api from "./axios";

export const listTasks = (applicationId) => api.get(`/tasks/${applicationId}`).then((r) => r.data);
export const submitTask = (applicationId, taskNumber, payload) =>
  api.post(`/tasks/${applicationId}/${taskNumber}/submit`, payload).then((r) => r.data);
export const generateCertificate = (applicationId) =>
  api.post(`/tasks/${applicationId}/certificate`).then((r) => r.data);
