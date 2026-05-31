import "./Splash.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/auth");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash">
      <div className="logo-container">
  <span className="big-b">B</span>

  <span className="letter m">M</span>
  <span className="letter e1">e</span>
  <span className="letter s1">s</span>
  <span className="letter s2">s</span>
  <span className="letter e2">e</span>
  <span className="letter n">n</span>
  <span className="letter g">g</span>
  <span className="letter e3">e</span>
  <span className="letter r">r</span>
</div>

      <p className="tagline">
        Connect Beyond Limits ✨
      </p>
    </div>
  );
}