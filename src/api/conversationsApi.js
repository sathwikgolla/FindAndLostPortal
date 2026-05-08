import { apiClient } from "@/api/apiClient";

export async function startConversation(itemId) {
  const res = await apiClient.post(`/conversations/start/${itemId}`);
  return res.data;
}

export async function listConversations() {
  const res = await apiClient.get("/conversations");
  return res.data;
}

export async function getConversation(id) {
  const res = await apiClient.get(`/conversations/${id}`);
  return res.data;
}

export async function sendMessage(id, text) {
  const res = await apiClient.post(`/conversations/${id}/messages`, { text });
  return res.data;
}

export async function markRead(id) {
  const res = await apiClient.put(`/conversations/${id}/read`);
  return res.data;
}

export async function confirmSolved(id) {
  const res = await apiClient.put(`/conversations/${id}/solve`);
  return res.data;
}

