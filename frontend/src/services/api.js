import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const TOKEN_STORAGE_KEY = "task_manager_token";

let authLogoutHandler = null;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof authLogoutHandler === "function") {
      authLogoutHandler();
    }
    return Promise.reject(error);
  }
);

export const registerAuthLogoutHandler = (handler) => {
  authLogoutHandler = handler;
};

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
};

export const taskApi = {
  getAll: () => api.get("/tasks"),
  create: (payload) => api.post("/tasks", payload),
  update: (taskId, payload) => api.put(`/tasks/${taskId}`, payload),
  remove: (taskId) => api.delete(`/tasks/${taskId}`),
};

export const getApiErrorMessage = (error, fallback = "Something went wrong.") =>
  error?.response?.data?.message || fallback;

export default api;
