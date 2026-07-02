import api from "./axios";

export const createApplication = (payload) => api.post("/applications", payload).then((r) => r.data);
export const listMyApplications = () => api.get("/applications").then((r) => r.data);
export const getApplication = (applicationId) => api.get(`/applications/${applicationId}`).then((r) => r.data);

export const getDashboardOverview = () => api.get("/students/me/overview").then((r) => r.data);
export const getDigitalId = (applicationId) => api.get(`/students/me/digital-id/${applicationId}`).then((r) => r.data);
export const getProfile = () => api.get("/students/me/profile").then((r) => r.data);
export const updateProfile = (payload) => api.put("/students/me/profile", payload).then((r) => r.data);

export const verifyCertificatePublic = (params) =>
  api.get("/certificates/verify", { params }).then((r) => r.data);
