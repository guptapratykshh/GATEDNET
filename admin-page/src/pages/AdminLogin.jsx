import React, { useState, useEffect } from "react";
import { adminLogin } from "../api/admin";
import { getIdTokenFromCustomToken } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function AdminLogin({ setIsAuthenticated }) {
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
      console.log("Starting login process...");
      const res = await adminLogin(form);
      console.log("Login API response:", res);
      
      if (res.error) {
        setError(res.error);
        return;
      }
      
      if (!res.token) {
        setError("Authentication failed: No token received");
        return;
      }
      
      try {
        console.log("Attempting to get ID token from custom token...");
        const idToken = await getIdTokenFromCustomToken(res.token);
        console.log("Successfully obtained ID token");
        
        localStorage.setItem("admin_id_token", idToken);
        localStorage.setItem("admin_user", JSON.stringify(res.admin));
        
        setIsAuthenticated(true);
        console.log("Login successful, redirecting to dashboard...");
        navigate("/dashboard");
      } catch (firebaseError) {
        console.error("Firebase auth error:", firebaseError);
        setError(firebaseError.message || "Authentication error. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message || "Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        {/* Icon goes here if you have one */}
        <div className="auth-header-title">GREENLAND SOCIETY</div>
        <div className="auth-header-subtitle">Resident Portal</div>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Admin Login</h2>
        <div className="form-group">
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            value={form.email}
            onChange={handleChange} 
            required 
            className="form-control"
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            value={form.password}
            onChange={handleChange} 
            required 
            className="form-control"
            disabled={loading}
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        <div className="auth-link">
          New to GATENET? <Link to="/admin/signup">Sign up</Link>
        </div>
      </form>
    </div>
  );
}