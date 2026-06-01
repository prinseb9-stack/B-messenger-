import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Lock, User, ArrowRight } from "lucide-react";
import { registerUser, loginUser, saveToken } from "../api";

function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit() {
    setError("");
    setLoading(true);

    try {
      // Convert phone to email format for now
      const email = `${phone}@bmessenger.com`;

      let data;
      if (isSignup) {
        data = await registerUser(username, email, password);
      } else {
        data = await loginUser(email, password);
      }

      saveToken(data.token);
      navigate("/otp");

    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

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
            <input
              className="country-code"
              type="text"
              defaultValue="+234"
              maxLength={5}
            />
            <Phone size={15} color="#475569" />
            <input
              type="text"
              placeholder="Enter phone number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>
        </div>

        {isSignup && (
          <div className="form-group">
            <label>Username</label>
            <div className="input-icon-wrap">
              <User size={15} color="#475569" />
              <input
                type="text"
                placeholder="@username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label>Password</label>
          <div className="input-icon-wrap">
            <Lock size={15} color="#475569" />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <p className="auth-error">{error}</p>
        )}

        <button
          className="auth-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Please wait..." : isSignup ? "Create Account" : "Login"}
          {!loading && <ArrowRight size={18} />}
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