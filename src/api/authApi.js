import { apiClient } from "@/api/apiClient";

export async function register(payload) {
  const res = await apiClient.post("/auth/register", payload);
  return res.data;
}

export async function login(payload) {
  const res = await apiClient.post("/auth/login", payload);
  return res.data;
}

export async function me() {
  const res = await apiClient.get("/auth/me");
  return res.data;
}

export async function updateProfile(payload) {
  const res = await apiClient.put("/auth/update-profile", payload);
  return res.data;
}

export async function changePassword(payload) {
  const res = await apiClient.put("/auth/change-password", payload);
  return res.data;
}

export async function logout() {
  const res = await apiClient.post("/auth/logout");
  return res.data;
}

export async function refresh() {
  const res = await apiClient.get("/auth/refresh");
  return res.data;
}

export async function verifyEmail(payload) {
  const res = await apiClient.post("/auth/verify-email", payload);
  return res.data;
}
