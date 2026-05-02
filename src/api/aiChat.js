
const BASE_URL = import.meta.env.VITE_API_URL;

const streamChatAPI = async (
  userMessage,
  token,
  onChunk,
  onDone,
  onError
) => {
  try {
    const response = await fetch(`${BASE_URL}/api/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      throw new Error("Stream request failed");
    }

    if (!response.body) {
      throw new Error("No stream body");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      const lines = chunk.split("\n");

      for (let line of lines) {
        if (!line.startsWith("data: ")) continue;

        const data = line.replace("data: ", "");

        if (data === "[DONE]") {
          onDone?.(fullText);
          return;
        }

        fullText += data;
        onChunk?.(fullText);
      }
    }
  } catch (error) {
    console.error("STREAM API ERROR:", error.message);
    onError?.(error);
  }
};

export default streamChatAPI;