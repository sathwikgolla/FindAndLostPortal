import { apiClient } from "@/api/apiClient";

export async function getAdminStats() {
  const res = await apiClient.get("/admin/stats");
  return res.data;
}

export async function getUsers(params) {
  const res = await apiClient.get("/admin/users", { params });
  return res.data;
}

export async function getItems(params) {
  const res = await apiClient.get("/admin/items", { params });
  return res.data;
}

export async function approveItem(id) {
  const res = await apiClient.put(`/admin/items/${id}/approve`);
  return res.data;
}

export async function rejectItem(id) {
  const res = await apiClient.put(`/admin/items/${id}/reject`);
  return res.data;
}

export async function deleteItem(id) {
  const res = await apiClient.delete(`/admin/items/${id}`);
  return res.data;
}

export async function getClaims(params) {
  const res = await apiClient.get("/admin/claims", { params });
  return res.data;
}

export async function getLogs(params) {
  const res = await apiClient.get("/admin/logs", { params });
  return res.data;
}

