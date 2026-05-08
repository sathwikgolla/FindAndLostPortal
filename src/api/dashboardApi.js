import { apiClient } from "@/api/apiClient";

export async function getStats() {
  const res = await apiClient.get("/dashboard/stats");
  return res.data;
}

export async function getRecentItems() {
  const res = await apiClient.get("/dashboard/recent-items");
  return res.data;
}

export async function getMyActivity() {
  const res = await apiClient.get("/dashboard/my-activity");
  return res.data;
}

