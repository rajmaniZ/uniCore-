
import axios from "axios";

const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL;
  return url ? `${url}/api` : "https://unicore-bone-nvsv.onrender.com";
};

const API = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token && token.split(".").length === 3) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
