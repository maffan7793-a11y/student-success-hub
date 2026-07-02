import api from "./axios";

export const registerStudent = (payload) => api.post("/auth/register", payload).then((r) => r.data);
export const loginStudent = (payload) => api.post("/auth/login", payload).then((r) => r.data);
export const adminLogin = (payload) => api.post("/auth/admin/login", payload).then((r) => r.data);
export const forgotPassword = (email) => api.post("/auth/forgot-password", { email }).then((r) => r.data);
export const resetPassword = (payload) => api.post("/auth/reset-password", payload).then((r) => r.data);
export const fetchMe = () => api.get("/auth/me").then((r) => r.data);
