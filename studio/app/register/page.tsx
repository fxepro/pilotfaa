"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { User, Lock, Mail, UserPlus, ArrowLeft } from "lucide-react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? (typeof window !== "undefined" ? "" : "http://localhost:8000");

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const regRes = await axios.post(`${API_BASE}/api/register/`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        role: "student",
      });

      const loginRes = await axios.post(`${API_BASE}/api/token/`, {
        username: formData.username,
        password: formData.password,
      });

      localStorage.setItem("access_token", loginRes.data.access);
      localStorage.setItem("refresh_token", loginRes.data.refresh);

      const userRes = await axios.get(`${API_BASE}/api/user-info/`, {
        headers: { Authorization: `Bearer ${loginRes.data.access}` },
      });

      const emailVerified = regRes.data.email_verified ?? false;

      if (!emailVerified) {
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
      } else if (userRes.data.role === "admin") {
        router.push("/workspace");
      } else {
        router.push("/lms");
      }
    } catch (err: any) {
      console.error("Registration error:", err);

      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.username) {
        setError("Username already exists. Please choose a different one.");
      } else if (err.response?.data?.email) {
        setError("Email already exists. Please use a different email.");
      } else if (err.message?.includes("Network Error") || err.code === "ECONNREFUSED") {
        setError("Cannot connect to server. Please check if the backend is running.");
      } else if (err.response?.status === 429) {
        setError("Too many registration attempts. Please try again later.");
      } else {
        setError(err.response?.data?.message || err.message || "Registration failed. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="pf-auth-shell">
      <div className="pf-auth-inner">
        <div className="pf-auth-brand">
          <div className="pf-auth-brand-mark">✈</div>
          <div className="pf-auth-brand-title">
            Pilot<em>FAA</em>
          </div>
          <div className="pf-auth-brand-sub">Ground School</div>
        </div>

        <div className="pf-auth-card">
          <div className="pf-auth-card-h">
            <div className="pf-auth-card-title">Create account</div>
            <div className="pf-auth-card-desc">Join PilotFAA to start studying</div>
          </div>

          <form className="pf-auth-form" onSubmit={handleSubmit}>
            <div className="pf-auth-row2">
              <div className="pf-auth-field">
                <label className="pf-auth-label" htmlFor="first_name">
                  First name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  className="pf-auth-input pf-auth-input--nopad"
                  placeholder="John"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="pf-auth-field">
                <label className="pf-auth-label" htmlFor="last_name">
                  Last name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  className="pf-auth-input pf-auth-input--nopad"
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="pf-auth-field">
              <label className="pf-auth-label" htmlFor="username">
                Username
              </label>
              <div className="pf-auth-input-wrap">
                <User className="pf-auth-icon" aria-hidden />
                <input
                  id="username"
                  name="username"
                  type="text"
                  className="pf-auth-input"
                  placeholder="johndoe"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="pf-auth-field">
              <label className="pf-auth-label" htmlFor="email">
                Email
              </label>
              <div className="pf-auth-input-wrap">
                <Mail className="pf-auth-icon" aria-hidden />
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="pf-auth-input"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="pf-auth-field">
              <label className="pf-auth-label" htmlFor="password">
                Password
              </label>
              <div className="pf-auth-input-wrap">
                <Lock className="pf-auth-icon" aria-hidden />
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="pf-auth-input"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="pf-auth-field">
              <label className="pf-auth-label" htmlFor="confirmPassword">
                Confirm password
              </label>
              <div className="pf-auth-input-wrap">
                <Lock className="pf-auth-icon" aria-hidden />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="pf-auth-input"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {error ? <div className="pf-auth-error">{error}</div> : null}

            <button type="submit" className="pf-btn-primary pf-auth-submit" disabled={loading}>
              <UserPlus style={{ width: 16, height: 16 }} />
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <div className="pf-auth-links">
            Already have an account? <Link href="/login">Sign in</Link>
          </div>
          <div className="pf-auth-back">
            <Link href="/">
              <ArrowLeft style={{ width: 14, height: 14 }} />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
