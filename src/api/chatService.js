import API from "./axios";

// 🔹 Simple (non-stream) fallback
export const sendChatMessage = async (message) => {
  const res = await API.post("/chat", { message });
  return res.data;
};