import React, { useState, useEffect } from "react";
import { adminSignup } from "../api/admin";
import { getIdTokenFromCustomToken } from "../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

export default function AdminSignup() {
  const [form, setForm] = useState({ 
    email: "", 
    password: "", 
    name: "", 
    societyId: "" 
  });
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
      console.log("Submitting form with data:", form);
      const res = await adminSignup(form);
      console.log("Response from server:", res);
      
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
        setError(res.error || "Signup failed. Please check your information.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h2>Admin Signup</h2>
        <div className="form-group">
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            onChange={handleChange} 
            required 
            autoComplete="email"
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
            autoComplete="new-password"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <input 
            name="name" 
            type="text"
            placeholder="Name" 
            onChange={handleChange} 
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <input 
            name="societyId" 
            type="text"
            placeholder="Society ID" 
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
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        {error && <div className="error-message">{error}</div>}
        <div className="auth-link">
          Already have an account? <Link to="/admin/login">Login</Link>
        </div>
      </form>
    </div>
  );
}