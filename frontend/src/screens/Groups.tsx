import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Users } from "lucide-react";
import "./Groups.css";

const groups = [
  { id: 1, name: "Dev Group 🔥", avatar: "D", color: "#4f9dff", members: 8, last: "Emeka: Push the PR", time: "Mon", unread: 12 },
  { id: 2, name: "Family ❤️", avatar: "F", color: "#ef4444", members: 12, last: "Mum: Dinner is ready!", time: "Yesterday", unread: 3 },
  { id: 3, name: "Street Gang 😂", avatar: "S", color: "#10b981", members: 5, last: "Tunde: Oya let's go!", time: "Yesterday", unread: 0 },
  { id: 4, name: "Work Crew 💼", avatar: "W", color: "#8b5cf6", members: 20, last: "Boss: Meeting at 9", time: "Mon", unread: 7 },
  { id: 5, name: "School Guys 🎓", avatar: "S", color: "#f59e0b", members: 15, last: "Ngozi: Results are out!", time: "Sun", unread: 0 },
];

export default function Groups() {
  const navigate = useNavigate();

  return (
    <div className="groups-page">

      {/* TOPBAR */}
      <div className="groups-topbar">
        <button className="back-btn" onClick={() => navigate("/home")}>
          <ArrowLeft size={22} />
        </button>
        <h2 className="groups-title">Groups</h2>
        <button className="new-group-btn">
          <Plus size={20} />
          New
        </button>
      </div>

      {/* GROUP LIST */}
      <div className="groups-list">
        <p className="section-label">Your Groups</p>
        {groups.map((group, i) => (
          <motion.div
            key={group.id}
            className="group-item"
            onClick={() => navigate("/chat")}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="group-avatar" style={{ background: group.color }}>
              {group.avatar}
            </div>
            <div className="group-info">
              <div className="group-top">
                <span className="group-name">{group.name}</span>
                <span className="group-time">{group.time}</span>
              </div>
              <div className="group-bottom">
                <span className="group-last">{group.last}</span>
                {group.unread > 0 && (
                  <span className="unread-badge">{group.unread}</span>
                )}
              </div>
              <div className="group-members">
                <Users size={11} color="#475569" />
                <span>{group.members} members</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}