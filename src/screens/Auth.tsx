import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Lock, User, ArrowRight } from "lucide-react";

function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1 className="auth-logo">B-Messenger</h1>

        <p className="auth-subtitle">
          Connect Beyond Limits ✨
        </p>

        <div className="form-group">
          <label>Phone Number</label>
          <div className="phone-input">
            <span>+234</span>
            <Phone size={15} color="#475569" />
            <input type="text" placeholder="Enter phone number" />
          </div>
        </div>

        {isSignup && (
          <div className="form-group">
            <label>Username</label>
            <div className="input-icon-wrap">
              <User size={15} color="#475569" />
              <input type="text" placeholder="@username" />
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Password</label>
          <div className="input-icon-wrap">
            <Lock size={15} color="#475569" />
            <input type="password" placeholder="Enter password" />
          </div>
        </div>

        <button className="auth-btn" onClick={() => navigate("/otp")}>
          {isSignup ? "Create Account" : "Login"}
          <ArrowRight size={18} />
        </button>

        <p className="switch-text">
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? " Login" : " Sign up"}
          </span>
        </p>

      </motion.div>
    </div>
  );
}

export default Auth;