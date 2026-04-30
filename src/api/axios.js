// 
// import axios from "axios";

// const normalizeBaseUrl = (raw) => {
//   if (!raw) return "http://localhost:5000/api";
//   const cleaned = String(raw).trim().replace(/;$/, "");
//   if (/^https?:\/\//i.test(cleaned)) return cleaned;
//   return `http://${cleaned}`;
// };

// const API = axios.create({
//   baseURL: normalizeBaseUrl(
//     import.meta.env.VITE_API_URL ||
//     import.meta.env.REACT_APP_API_URL ||
//     "http://localhost:5000/api"
//   ),
//   timeout: 15000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// API.interceptors.request.use(
//   (config) => {
//     try {
//       const token = localStorage.getItem("token");
//       const cleanedToken = typeof token === "string" ? token.trim() : "";
//       const isUsableToken =
//         cleanedToken &&
//         cleanedToken !== "undefined" &&
//         cleanedToken !== "null" &&
//         cleanedToken.split(".").length === 3;

//       if (isUsableToken) {
//         config.headers = config.headers || {};
//         config.headers.Authorization = `Bearer ${cleanedToken}`;
//       } else if (token) {
//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//       }
//     } catch (_) {}
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response?.status;
//     if (status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       if (window.location.pathname !== "/login") {
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default API;


import axios from "axios";

const getBaseURL = () => {
  const url = import.meta.env.VITE_API_URL;
  return url ? `${url}/api` : "http://localhost:5000/api";
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