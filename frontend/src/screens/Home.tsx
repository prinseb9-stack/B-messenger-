import "./Home.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MoreVertical, MessageCircle, Phone, Users, User } from "lucide-react";
import { connectSocket } from "../socket";

const stories = [
  { id: 1, name: "My Status", avatar: "Y", color: "#4f9dff", isMe: true },
  { id: 2, name: "Tunde", avatar: "T", color: "#f97316" },
  { id: 3, name: "Amaka", avatar: "A", color: "#8b5cf6" },
  { id: 4, name: "Chidi", avatar: "C", color: "#10b981" },
  { id: 5, name: "Ngozi", avatar: "N", color: "#ef4444" },
  { id: 6, name: "Emeka", avatar: "E", color: "#f59e0b" },
];

const chats = [
  { id: 1, name: "Tunde", avatar: "T", color: "#f97316", last: "You up? 👀", time: "7:10 AM", unread: 2 },
  { id: 2, name: "Amaka", avatar: "A", color: "#8b5cf6", last: "Lol okay 😂", time: "6:45 AM", unread: 0 },
  { id: 3, name: "Chidi", avatar: "C", color: "#10b981", last: "Send me the file", time: "Yesterday", unread: 5 },
  { id: 4, name: "Ngozi", avatar: "N", color: "#ef4444", last: "Good night 🌙", time: "Yesterday", unread: 0 },
  { id: 5, name: "Dev Group 🔥", avatar: "D", color: "#4f9dff", last: "Emeka: Push the PR", time: "Mon", unread: 12 },
  { id: 6, name: "Emeka", avatar: "E", color: "#f59e0b", last: "Oya let's go!", time: "Mon", unread: 0 },
];

function Avatar({ name, color, size = 46 }: { name: string; color: string; size?: number }) {
  return (
    <div className="avatar" style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}>
      {name}
    </div>
  );
}

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    connectSocket();
  }, []);

  return (
    <div className="home-page">

      {/* TOP BAR */}
      <div className="topbar">
        <h1 className="home-logo">B-Messenger</h1>
        <div className="topbar-icons">
          <button className="icon-btn"><Search size={18} /></button>
          <button className="icon-btn"><MoreVertical size={18} /></button>
        </div>
      </div>

      {/* STORIES */}
      <div className="stories-bar">
        {stories.map(s => (
          <div className="story-item" key={s.id}>
            <div className="story-ring" style={{ borderColor: s.isMe ? "transparent" : s.color }}>
              <Avatar name={s.avatar} color={s.color} size={48} />
              {s.isMe && <div className="story-add">+</div>}
            </div>
            <span className="story-name">{s.isMe ? "My Status" : s.name}</span>
          </div>
        ))}
      </div>

      {/* CHAT LIST */}
      <div className="chat-list">
        <p className="section-label">Messages</p>
        {chats.map(chat => (
          <motion.div
            className="chat-item"
            key={chat.id}
            onClick={() => navigate("/chat")}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: chat.id * 0.05 }}
          >
            <Avatar name={chat.avatar} color={chat.color} />
            <div className="chat-info">
              <div className="chat-top">
                <span className="chat-name">{chat.name}</span>
                <span className="chat-time">{chat.time}</span>
              </div>
              <div className="chat-bottom">
                <span className="chat-last">{chat.last}</span>
                {chat.unread > 0 && (
                  <span className="unread-badge">{chat.unread}</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* BOTTOM NAV */}
      <div className="bottom-nav">
        <button className="nav-btn active">
          <MessageCircle size={22} />
          <label>Chats</label>
        </button>
        <button className="nav-btn" onClick={() => navigate("/calls")}>
          <Phone size={22} />
          <label>Calls</label>
        </button>
        <button className="nav-btn" onClick={() => navigate("/groups")}>
          <Users size={22} />
          <label>Groups</label>
        </button>
        <button className="nav-btn" onClick={() => navigate("/profile")}>
          <User size={22} />
          <label>Profile</label>
        </button>
      </div>

    </div>
  );
}

export default Home;