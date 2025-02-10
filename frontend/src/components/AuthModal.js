import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AuthModal.module.css";

function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true); // ✅ Toggle between Login & Register
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"; // ✅ Disable scrolling when modal opens
    } else {
      document.body.style.overflow = "auto"; // ✅ Enable scrolling when modal closes
    }

    return () => {
      document.body.style.overflow = "auto"; // ✅ Ensure scrolling is re-enabled on unmount
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? "http://localhost:5000/api/auth/login" : "http://localhost:5000/api/auth/register";
    const payload = isLogin ? { email: formData.email, password: formData.password } : formData;

    try {
      const res = await axios.post(url, payload);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onAuthSuccess(); 
      onClose(); 
    } catch (error) {
      alert(error.response?.data?.msg || "Authentication failed");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeBtn} onClick={onClose}>✖</button>
        <h2>{isLogin ? "Login" : "Register"}</h2>

        <form className={styles.authForm} onSubmit={handleSubmit}>
          {!isLogin && (
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} required />
          )}
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
          <button type="submit" className="auth-btn">{isLogin ? "Login" : "Register"}</button>
        </form>

        <p onClick={() => setIsLogin(!isLogin)} className={styles.toggleAuth}>
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}

export default AuthModal;
