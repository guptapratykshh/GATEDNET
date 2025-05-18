import React, { useState, useEffect } from "react";
import { adminLogin } from "../api/admin";
import { getIdTokenFromCustomToken } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const token = localStorage.getItem("admin_id_token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const res = await adminLogin(form);
      console.log("Login response:", res);
      
      if (res.token) {
        try {
          const idToken = await getIdTokenFromCustomToken(res.token);
          localStorage.setItem("admin_id_token", idToken);
          localStorage.setItem("admin_user", JSON.stringify(res.admin));
          navigate("/dashboard");
        } catch (firebaseError) {
          console.error("Firebase auth error:", firebaseError);
          setError("Authentication error with Firebase. Please try again.");
        }
      } else {
        setError(res.error || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Admin Login</h2>
        <div className="form-group">
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            onChange={handleChange} 
            required 
            className="form-control"
          />
        </div>
        <div className="form-group">
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            onChange={handleChange} 
            required 
            className="form-control"
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <div className="error-message">{error}</div>}
        <div className="auth-link">
          New to GATENET? <Link to="/admin/signup">Sign up</Link>
        </div>
      </form>
    </div>
  );
}