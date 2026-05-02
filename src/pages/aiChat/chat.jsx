import { useState, useRef, useEffect } from "react";
import styles from "./chat.module.css";
import streamChatAPI from "./../../api/aiChat";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark.css";

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatMarkdown = (text) => {
    if (!text) return "";

    return text
      .replace(/\r/g, "")
      .replace(/\n{1}/g, "\n\n") 
      .replace(/(##|###)/g, "\n\n$1") 
      .replace(/```/g, "\n```"); // fix code block start
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();

    setInput("");
    setLoading(true);

    // Add user + assistant placeholder
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userText },
      { role: "assistant", content: "" },
    ]);

    await streamChatAPI(
      userText,
      token,

      // ✅ STREAM UPDATE
      (chunkText) => {
        setMessages((prev) => {
          const updated = [...prev];

          updated[updated.length - 1].content = formatMarkdown(chunkText);

          return updated;
        });
      },

      () => setLoading(false),

      (err) => {
        console.error("Chat error:", err);

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content =
            "❌ Something went wrong. Please try again.";
          return updated;
        });

        setLoading(false);
      }
    );
  };

  return (
    <div className={styles.container}>
      {/* 💬 Chat */}
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
              <div className={styles.markdown}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    // spacing
                    p: ({ children }) => (
                      <p style={{ marginBottom: "10px" }}>{children}</p>
                    ),

                    li: ({ children }) => (
                      <li style={{ marginBottom: "6px" }}>{children}</li>
                    ),

                    // 🔥 CODE BLOCK WITH COPY BUTTON
                    code({ inline, className, children, ...props }) {
                      const text = String(children);

                      if (!inline) {
                        return (
                          <div style={{ position: "relative" }}>
                            <button
                              onClick={() =>
                                navigator.clipboard.writeText(text)
                              }
                              style={{
                                position: "absolute",
                                top: 6,
                                right: 6,
                                fontSize: "12px",
                                padding: "4px 8px",
                                cursor: "pointer",
                                background: "#1e293b",
                                color: "#fff",
                                border: "none",
                                borderRadius: "6px",
                              }}
                            >
                              Copy
                            </button>

                            <pre className={className}>
                              <code {...props}>{children}</code>
                            </pre>
                          </div>
                        );
                      }

                      return (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.content || "Typing..."}
                </ReactMarkdown>
              </div>
            ) : (
              msg.content
            )}
          </div>
        ))}

        <div ref={chatEndRef} />
      </div>

      {/* ✏️ Input */}
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