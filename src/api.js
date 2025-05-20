import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// 👉 automatically add Bearer token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");     // token stored at login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
