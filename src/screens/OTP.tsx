import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./OTP.css";

function OTP() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => { inputs.current[0]?.focus(); }, []);

  useEffect(() => {
    if (timer === 0) { setCanResend(true); return; }
    const t = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  function handleChange(val: string, i: number) {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent, i: number) {
    if (e.key === "Backspace" && !otp[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const digits = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...otp];
    digits.split("").forEach((d, i) => (next[i] = d));
    setOtp(next);
    inputs.current[Math.min(digits.length, 5)]?.focus();
  }

  function handleVerify() {
    navigate("/home");
  }

  return (
    <div className="otp-page">
      <motion.div
        className="otp-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="otp-icon">📱</div>

        <h2 className="otp-title">Verify your number</h2>
        <p className="otp-sub">
          We sent a 6-digit code to <span>+234 ••• ••• ••••</span>
        </p>

        <div className="otp-inputs" onPaste={handlePaste}>
          {otp.map((digit, i) => (
            <motion.input
              key={i}
              ref={el => { inputs.current[i] = el; }}
              className={`otp-box${digit ? " filled" : ""}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleChange(e.target.value, i)}
              onKeyDown={e => handleKeyDown(e, i)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            />
          ))}
        </div>

        <button className="otp-btn" onClick={handleVerify}>
          Verify
        </button>

        <p className="resend-text">
          {canResend ? (
            <>Didn't get a code? <span onClick={() => { setTimer(60); setCanResend(false); }}>Resend</span></>
          ) : (
            <>Resend code in <span className="timer">{timer}s</span></>
          )}
        </p>

      </motion.div>
    </div>
  );
}

export default OTP;