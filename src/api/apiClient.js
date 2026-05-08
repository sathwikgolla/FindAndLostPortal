import axios from "axios";

const baseURL =
  process.env.VITE_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

const TOKEN_KEY = "findandlost_token";

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  if (typeof window === "undefined") return;
  if (!token) window.localStorage.removeItem(TOKEN_KEY);
  else window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  setStoredToken(null);
}

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 20000
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function toCleanError(err) {
  const message =
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "Request failed";
  const status = err?.response?.status;
  return { message, status, raw: err };
}

apiClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const clean = toCleanError(err);
    if (clean.status === 401 && typeof window !== "undefined") {
      const original = err?.config;
      const alreadyRetried = original?._retry === true;
      if (!alreadyRetried) {
        try {
          original._retry = true;
          const refreshRes = await axios.get(`${baseURL}/auth/refresh`, { withCredentials: true, timeout: 20000 });
          const token = refreshRes?.data?.data?.token;
          if (token) {
            setStoredToken(token);
            original.headers = original.headers || {};
            original.headers.Authorization = `Bearer ${token}`;
            return apiClient.request(original);
          }
        } catch {
          // fallthrough to logout
        }
      }

      clearStoredToken();
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      if (!window.location.pathname.startsWith("/auth")) {
        window.location.href = `/auth?next=${next}`;
      }
    }
    return Promise.reject(clean);
  }
);
