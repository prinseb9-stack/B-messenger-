import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="profile-page">

      {/* TOPBAR */}
      <div className="profile-topbar">
        <button className="back-btn" onClick={() => navigate("/home")}>‹</button>
        <h2>Profile</h2>
        <button className="edit-btn">Edit</button>
      </div>

      {/* AVATAR */}
      <div className="profile-hero">
        <div className="profile-avatar">Y</div>
        <button className="avatar-edit">📷</button>
        <h2 className="profile-name">Your Name</h2>
        <p className="profile-phone">+234 801 234 5678</p>
        <p className="profile-bio">Hey there! I'm using B-Messenger 👋</p>
      </div>

      {/* OPTIONS */}
      <div className="profile-section">
        <div className="section-title">Account</div>

        <div className="profile-item">
          <span className="item-icon">👤</span>
          <div className="item-info">
            <span className="item-label">Username</span>
            <span className="item-value">@yourname</span>
          </div>
          <span className="item-arrow">›</span>
        </div>

        <div className="profile-item">
          <span className="item-icon">📱</span>
          <div className="item-info">
            <span className="item-label">Phone Number</span>
            <span className="item-value">+234 801 234 5678</span>
          </div>
          <span className="item-arrow">›</span>
        </div>

        <div className="profile-item">
          <span className="item-icon">✏️</span>
          <div className="item-info">
            <span className="item-label">Bio</span>
            <span className="item-value">Hey there! I'm using B-Messenger 👋</span>
          </div>
          <span className="item-arrow">›</span>
        </div>
      </div>

      <div className="profile-section">
        <div className="section-title">Preferences</div>

        <div className="profile-item">
          <span className="item-icon">🔔</span>
          <div className="item-info">
            <span className="item-label">Notifications</span>
            <span className="item-value">On</span>
          </div>
          <span className="item-arrow">›</span>
        </div>

        <div className="profile-item">
          <span className="item-icon">🔒</span>
          <div className="item-info">
            <span className="item-label">Privacy</span>
            <span className="item-value">Everyone</span>
          </div>
          <span className="item-arrow">›</span>
        </div>

        <div className="profile-item">
          <span className="item-icon">🎨</span>
          <div className="item-info">
            <span className="item-label">Theme</span>
            <span className="item-value">Dark</span>
          </div>
          <span className="item-arrow">›</span>
        </div>
      </div>

      {/* LOGOUT */}
      <div className="profile-section">
        <div className="profile-item logout" onClick={() => navigate("/")}>
          <span className="item-icon">🚪</span>
          <div className="item-info">
            <span className="item-label">Logout</span>
          </div>
          <span className="item-arrow">›</span>
        </div>
      </div>

    </div>
  );
}