import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, Video, PhoneIncoming, PhoneMissed, PhoneOutgoing } from "lucide-react";
import "./Calls.css";

const calls = [
  { id: 1, name: "Tunde", avatar: "T", color: "#f97316", type: "incoming", time: "Today, 7:15 AM", duration: "5 mins" },
  { id: 2, name: "Amaka", avatar: "A", color: "#8b5cf6", type: "missed", time: "Today, 6:50 AM", duration: "" },
  { id: 3, name: "Chidi", avatar: "C", color: "#10b981", type: "outgoing", time: "Yesterday, 3:00 PM", duration: "12 mins" },
  { id: 4, name: "Ngozi", avatar: "N", color: "#ef4444", type: "missed", time: "Yesterday, 1:20 PM", duration: "" },
  { id: 5, name: "Emeka", avatar: "E", color: "#f59e0b", type: "incoming", time: "Mon, 10:00 AM", duration: "2 mins" },
  { id: 6, name: "Dev Group 🔥", avatar: "D", color: "#4f9dff", type: "outgoing", time: "Mon, 9:00 AM", duration: "30 mins" },
];

function CallIcon({ type }: { type: string }) {
  if (type === "incoming") return <PhoneIncoming size={16} color="#10b981" />;
  if (type === "missed") return <PhoneMissed size={16} color="#ef4444" />;
  return <PhoneOutgoing size={16} color="#4f9dff" />;
}

export default function Calls() {
  const navigate = useNavigate();

  return (
    <div className="calls-page">

      {/* TOPBAR */}
      <div className="calls-topbar">
        <button className="back-btn" onClick={() => navigate("/home")}>
          <ArrowLeft size={22} />
        </button>
        <h2 className="calls-title">Calls</h2>
      </div>

      {/* CALL LIST */}
      <div className="calls-list">
        <p className="section-label">Recent</p>
        {calls.map((call, i) => (
          <motion.div
            key={call.id}
            className="call-item"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="call-avatar" style={{ background: call.color }}>
              {call.avatar}
            </div>
            <div className="call-info">
              <div className="call-top">
                <span className="call-name">{call.name}</span>
                <span className="call-time">{call.time}</span>
              </div>
              <div className="call-bottom">
                <CallIcon type={call.type} />
                <span className={`call-type ${call.type}`}>
                  {call.type.charAt(0).toUpperCase() + call.type.slice(1)}
                  {call.duration ? ` • ${call.duration}` : ""}
                </span>
              </div>
            </div>
            <div className="call-btns">
              <button className="call-action-btn"><Phone size={18} /></button>
              <button className="call-action-btn"><Video size={18} /></button>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}