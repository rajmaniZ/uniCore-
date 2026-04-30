// // // ❌ NO 'use client'
// // // ❌ NOT a component

// // const streamChatAPI = async (
// //   userMessage,
// //   token,
// //   onChunk,
// //   onDone,
// //   onError
// // ) => {
// //   try {
// //     const response = await fetch("http://localhost:5000/api/chat", {
// //       method: "POST",
// //       headers: {
// //         "Content-Type": "application/json",
// //         ...(token && { Authorization: `Bearer ${token}` }),
// //       },
// //       body: JSON.stringify({
// //         message: userMessage,
// //       }),
// //     });

// //     if (!response.ok || !response.body) {
// //       throw new Error("Stream request failed");
// //     }

// //     const reader = response.body.getReader();
// //     const decoder = new TextDecoder("utf-8");

// //     let accumulatedText = "";

// //     while (true) {
// //       const { done, value } = await reader.read();

// //       if (done) break;

// //       const chunk = decoder.decode(value, { stream: true });

// //       accumulatedText += chunk;

// //       // 🔥 LIVE UI UPDATE
// //       if (onChunk) onChunk(accumulatedText);
// //     }

// //     if (onDone) onDone();
// //   } catch (error) {
// //     console.error("STREAM API ERROR:", error.message);

// //     if (onError) onError(error);
// //   }
// // };

// // export default streamChatAPI;
// const streamChatAPI = async (
//   userMessage,
//   token,
//   onChunk,
//   onDone,
//   onError
// ) => {
//   try {
//     const response = await fetch("http://localhost:5000/api/chat/stream", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         ...(token && { Authorization: `Bearer ${token}` }),
//       },
//       body: JSON.stringify({ message: userMessage }),
//     });

//     if (!response.ok || !response.body) {
//       throw new Error("Stream request failed");
//     }

//     const reader = response.body.getReader();
//     const decoder = new TextDecoder("utf-8");

//     let fullText = "";

//     while (true) {
//       const { done, value } = await reader.read();
//       if (done) break;

//       const chunk = decoder.decode(value, { stream: true });

//       const lines = chunk.split("\n");

//       for (let line of lines) {
//         if (!line.startsWith("data: ")) continue;

//         const data = line.replace("data: ", "");

//         if (data === "[DONE]") {
//           onDone?.(fullText);
//           return;
//         }

//         fullText += data + " ";
//         onChunk?.(fullText);
//       }
//     }
//   } catch (error) {
//     console.error("STREAM API ERROR:", error.message);
//     onError?.(error);
//   }
// };

// export default streamChatAPI;
const streamChatAPI = async (
  userMessage,
  token,
  onChunk,
  onDone,
  onError
) => {
  try {
    const response = await fetch("http://localhost:5000/api/chat/stream", {
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

      // ✅ handle SSE properly
      const lines = chunk.split("\n");

      for (let line of lines) {
        if (!line.startsWith("data: ")) continue;

        const data = line.replace("data: ", "");

        if (data === "[DONE]") {
          onDone?.(fullText);
          return;
        }

        // ✅ FINAL FIX (NO EXTRA SPACE)
        fullText += data;

        // 🔥 smooth live update
        onChunk?.(fullText);
      }
    }
  } catch (error) {
    console.error("STREAM API ERROR:", error.message);
    onError?.(error);
  }
};

export default streamChatAPI;