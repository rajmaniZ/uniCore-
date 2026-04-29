
import { useState, useRef, useEffect } from "react";
import styles from "./chat.module.css";
import streamChatAPI from "./../../api/aiChat";
import ReactMarkdown from "react-markdown";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  const token = localStorage.getItem("token");

  //  Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();

    setInput("");
    setLoading(true);

    // Add user + assistant
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userText },
      { role: "assistant", content: "" },
    ]);

    await streamChatAPI(
      userText,
      token,

      // STREAM UPDATE (FIXED SPACING)
      (chunkText) => {
        setMessages((prev) => {
          const updated = [...prev];

          //  IMPORTANT FIX
          updated[updated.length - 1].content = chunkText;

          return updated;
        });
      },

      () => setLoading(false),

      (err) => {
        console.error("Chat error:", err);

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content =
            " Something went wrong. Please try again.";
          return updated;
        });

        setLoading(false);
      }
    );
  };

  return (
    <div className={styles.container}>
      {/* 🔹 Chat Messages */}
      <div className={styles.chatBox}>
        {messages.length === 0 && (
          <div className={styles.emptyState}>
           Start a conversation...
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              msg.role === "user" ? styles.user : styles.assistant
            }`}
          >
            {msg.role === "assistant" ? (
              <ReactMarkdown>
                {msg.content || "Typing..."}
              </ReactMarkdown>
            ) : (
              msg.content
            )}
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* 🔹 Input */}
      <div className={styles.inputBox}>
        <input
          type="text"
          value={input}
          placeholder="Ask anything..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading}
        />

        <button onClick={handleSend} disabled={loading}>
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatPage;