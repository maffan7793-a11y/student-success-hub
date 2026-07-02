import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

function getTokens() {
  return {
    access: localStorage.getItem("ssh_access_token"),
    refresh: localStorage.getItem("ssh_refresh_token"),
  };
}

export function setTokens({ access_token, refresh_token }) {
  if (access_token) localStorage.setItem("ssh_access_token", access_token);
  if (refresh_token) localStorage.setItem("ssh_refresh_token", refresh_token);
}

export function clearTokens() {
  localStorage.removeItem("ssh_access_token");
  localStorage.removeItem("ssh_refresh_token");
}

api.interceptors.request.use((config) => {
  const { access } = getTokens();
  if (access) config.headers.Authorization = `Bearer ${access}`;
  return config;
});

let isRefreshing = false;
let queue = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes("/auth/")) {
      const { refresh } = getTokens();
      if (!refresh) {
        clearTokens();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post("/api/auth/refresh", {}, {
          headers: { Authorization: `Bearer ${refresh}` },
        });
        setTokens({ access_token: data.access_token });
        queue.forEach((p) => p.resolve());
        queue = [];
        return api(originalRequest);
      } catch (refreshError) {
        clearTokens();
        queue.forEach((p) => p.reject(refreshError));
        queue = [];
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
