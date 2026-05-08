import { apiClient } from "@/api/apiClient";

export async function listItems(params) {
  const res = await apiClient.get("/items", { params });
  return res.data;
}

export async function getItem(id) {
  const res = await apiClient.get(`/items/${id}`);
  return res.data;
}

export async function myReports() {
  const res = await apiClient.get("/items/user/my-reports");
  return res.data;
}

export async function reportItem(kind, payload) {
  // kind: "lost" | "found"
  const res = await apiClient.post(`/items/${kind}`, payload, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
}

export async function updateItem(id, payload) {
  const res = await apiClient.put(`/items/${id}`, payload, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
}

export async function deleteItem(id) {
  const res = await apiClient.delete(`/items/${id}`);
  return res.data;
}

