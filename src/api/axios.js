import axios from "axios";
import { toast } from "react-toastify";

let isSessionExpiredToastShown = false;
const api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/* ================= REQUEST ================= */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ================= RESPONSE ================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const publicEndpoints = [
      "/api/auth/login",
      "/api/auth/verify-otp",
      "/api/account",
      "/api/auth/resend-otp",
      "/api/auth/forgot-password",
      "/api/auth/verify-forgot-otp",
      "/api/auth/reset-password",
      "/auth/is-email-verified",
    ];
    const isPublic = publicEndpoints.some((endpoint) =>
      url?.includes(endpoint)
    );
    const message =
      typeof error.response?.data === "string"
        ? error.response.data
        : error.response?.data?.message || "";

    if (
      !isPublic &&
      (status === 401 ||
        status === 403 ||
        message.toLowerCase().includes("jwt expired") ||
        message.toLowerCase().includes("token expired"))
    ) {
      // clear auth
      if (!isSessionExpiredToastShown) {
        isSessionExpiredToastShown = true;

        localStorage.clear();
        setTimeout(() => {
          toast.error("Session expired. Please login again.");
          setTimeout(() => {
            window.location.href = "/login";
          }, 2900);
        }, 3900);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
