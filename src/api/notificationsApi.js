import { apiClient } from "@/api/apiClient";

export async function listNotifications() {
  const res = await apiClient.get("/notifications");
  return res.data;
}

export async function markRead(id) {
  const res = await apiClient.put(`/notifications/${id}/read`);
  return res.data;
}

export async function markReadAll() {
  const res = await apiClient.put("/notifications/read-all");
  return res.data;
}

export async function deleteNotification(id) {
  const res = await apiClient.delete(`/notifications/${id}`);
  return res.data;
}

