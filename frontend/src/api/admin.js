import api from "./axios";

export const getAdminDashboard = () => api.get("/admin/dashboard").then((r) => r.data);

export const listAdminStudents = (params) => api.get("/admin/students", { params }).then((r) => r.data);
export const deactivateStudent = (id) => api.post(`/admin/students/${id}/deactivate`).then((r) => r.data);

export const listAdminApplications = (params) => api.get("/admin/applications", { params }).then((r) => r.data);

export const listPendingTasks = () => api.get("/admin/tasks/pending").then((r) => r.data);
export const reviewTask = (submissionId, payload) => api.post(`/admin/tasks/${submissionId}/review`, payload).then((r) => r.data);

export const listAdminCertificates = () => api.get("/admin/certificates").then((r) => r.data);
export const adminGenerateCertificate = (applicationId) => api.post(`/admin/certificates/${applicationId}/generate`).then((r) => r.data);

export const listAdminPayments = () => api.get("/admin/payments").then((r) => r.data);
