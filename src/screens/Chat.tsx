import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, MoreVertical, Smile, Paperclip, Send } from "lucide-react";
import "./Chat.css";

const initialMessages = [
  { id: 1, from: "them", text: "Hey! You up? 👀", time: "7:10 AM" },
  { id: 2, from: "me", text: "Yeah just woke up 😂", time: "7:11 AM" },
  { id: 3, from: "them", text: "Oya let's call later", time: "7:12 AM" },
  { id: 4, from: "me", text: "Sure, give me an hour", time: "7:13 AM" },
];

export default function Chat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function send() {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { id: Date.now(), from: "me", text: input.trim(), time: now }]);
    setInput("");
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") send();
  }

  return (
    <div className="chat-page">

      {/* TOPBAR */}
      <div className="chat-topbar">
        <button className="back-btn" onClick={() => navigate("/home")}>
          <ArrowLeft size={22} />
        </button>
        <div className="chat-avatar" style={{ background: "#f97316" }}>T</div>
        <div className="chat-meta">
          <span className="chat-username">Tunde</span>
          <span className="chat-status">🟢 Online</span>
        </div>
        <div className="chat-actions">
          <button className="icon-btn"><Phone size={18} /></button>
          <button className="icon-btn"><MoreVertical size={18} /></button>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="messages-area">
        <div className="date-divider">Today</div>
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            className={`msg-row ${msg.from}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className={`bubble ${msg.from}`}>
              <p>{msg.text}</p>
              <span className="msg-time">{msg.time}</span>
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="chat-input-bar">
        <button className="icon-btn"><Smile size={22} /></button>
        <input
          className="chat-input"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
        />
        <button className="icon-btn"><Paperclip size={20} /></button>
        <button className="send-btn" onClick={send} disabled={!input.trim()}>
          <Send size={16} />
        </button>
      </div>

    </div>
  );
}