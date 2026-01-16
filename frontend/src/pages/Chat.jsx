import { useEffect, useRef, useState } from "react";
import API from "../services/api";
import MarkdownRenderer from "../components/MarkdownRenderer";

function Chat({ onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // File preview state (before sending)
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load chat history
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await API.get("/chat/history?limit=20");
        setMessages(res.data);
      } catch {
        console.error("Failed to load history");
      }
    };
    loadHistory();
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Upload file (indexed immediately, but only PREVIEWED in UI)
  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      if (res.ok) {
        setUploadedFile(file.name);
      } else {
        alert("File upload failed");
      }
    } catch {
      alert("File upload error");
    } finally {
      setUploading(false);
    }
  };

  // Send message (ChatGPT-style behavior)
  const sendMessage = async () => {
    if (!input.trim() || loading || uploading) return;

    // 1️⃣ If a file is selected, push it into chat NOW
    if (uploadedFile) {
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          type: "file",
          name: uploadedFile,
        },
      ]);
    }

    // 2️⃣ Push user text message
    const userMessage = {
      role: "user",
      type: "text",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setLoading(true);

    // 3️⃣ Stream AI response
    const response = await fetch(
      "http://127.0.0.1:8000/chat/message/stream",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ message: userMessage.content }),
      }
    );

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let aiText = "";

    setMessages((prev) => [
      ...prev,
      { role: "assistant", type: "text", content: "" },
    ]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      aiText += decoder.decode(value);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].content = aiText;
        return updated;
      });
    }

    // 4️⃣ Clear preview AFTER sending (ChatGPT behavior)
    setUploadedFile(null);
    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-black text-white p-4 flex justify-between items-center">
        <span className="text-lg font-semibold">Chat-Aura</span>
        <button
          onClick={onLogout}
          className="text-sm bg-red-500 px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => {
          // 📄 File message
          if (msg.type === "file") {
            return (
              <div
                key={idx}
                className="max-w-xl ml-auto bg-blue-100 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <span className="text-lg">📄</span>
                <span className="text-sm font-medium">{msg.name}</span>
              </div>
            );
          }

          // 💬 Text message
          return (
            <div
              key={idx}
              className={`max-w-xl px-4 py-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-blue-600 text-white ml-auto"
                  : "bg-white text-gray-800 mr-auto shadow"
              }`}
            >
              {msg.role === "assistant" ? (
                <MarkdownRenderer content={msg.content} />
              ) : (
                msg.content
              )}
            </div>
          );
        })}

        {loading && (
          <div className="text-gray-500 italic text-sm">
            AI is typing…
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="p-4 bg-white border-t">
        {/* 📄 File preview BEFORE sending */}
        {uploadedFile && (
          <div className="flex items-center justify-between bg-gray-100 border rounded-lg px-3 py-2 mb-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-lg">📄</span>
              <span className="font-medium">{uploadedFile}</span>
            </div>
            <button
              onClick={() => setUploadedFile(null)}
              className="text-red-500 text-xs hover:underline"
            >
              Remove
            </button>
          </div>
        )}

        <div className="flex gap-2 items-center">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf"
            onChange={(e) => handleFileUpload(e.target.files[0])}
          />

          {/* + Button */}
          <button
            onClick={() => fileInputRef.current.click()}
            className="text-xl px-3 py-1 border rounded hover:bg-gray-100"
            disabled={uploading}
          >
            +
          </button>

          {/* Text input */}
          <input
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none"
            placeholder={
              uploading
                ? "Uploading document..."
                : "Ask something about the document or chat normally..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={uploading}
          />

          <button
            onClick={sendMessage}
            disabled={loading || uploading}
            className="bg-black text-white px-6 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
