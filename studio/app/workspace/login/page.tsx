"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Lock, LogIn } from "lucide-react";
import { captureEvent, identifyUser } from "@/lib/posthog";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? (typeof window !== "undefined" ? "" : "http://localhost:8000");

export default function WorkspaceLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/api/token/`, { username, password });
      localStorage.setItem("access_token",  res.data.access);
      localStorage.setItem("refresh_token", res.data.refresh);
      localStorage.removeItem("pagerodeo_analysis_state");

      const userRes = await axios.get(`${API_BASE}/api/user-info/`, {
        headers: { Authorization: `Bearer ${res.data.access}` },
      });

      const role = userRes.data.role as string;

      captureEvent("user_logged_in", {
        username,
        role,
        timestamp: new Date().toISOString(),
        login_type: "workspace",
      });
      identifyUser(username, { role, email: userRes.data.email });

      const redirectUrl = sessionStorage.getItem("checkout_redirect");
      if (redirectUrl) {
        sessionStorage.removeItem("checkout_redirect");
        router.push(redirectUrl);
      } else if (role === "admin") {
        router.push("/workspace");
      } else {
        router.push("/lms");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        "Login failed. Please check your credentials."
      );
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0F1F3A 0%,#1756C8 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 12px" }}>✈</div>
          <div style={{ fontFamily: "Georgia,serif", fontSize: 24, fontWeight: 700, color: "#fff" }}>
            Pilot<span style={{ color: "#90cdf4" }}>FAA</span>
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "monospace", marginTop: 4 }}>
            Ground School
          </div>
        </div>

        <Card style={{ border: "none", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
          <CardHeader style={{ textAlign: "center", paddingBottom: 8 }}>
            <CardTitle style={{ fontSize: 20 }}>Sign In</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {error && (
                <div style={{ background: "#fee2e2", border: "1px solid #fecaca", color: "#dc2626", padding: "10px 14px", borderRadius: 7, fontSize: 13 }}>
                  {error}
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Label htmlFor="username">Username</Label>
                <div style={{ position: "relative" }}>
                  <User style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#94a3b8" }} />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    style={{ paddingLeft: 34 }}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Label htmlFor="password">Password</Label>
                <div style={{ position: "relative" }}>
                  <Lock style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#94a3b8" }} />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    style={{ paddingLeft: 34 }}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                style={{ background: "#1756C8", color: "#fff", marginTop: 4 }}
              >
                {loading ? (
                  <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", marginRight: 8 }} />Signing in…</>
                ) : (
                  <><LogIn style={{ width: 16, height: 16, marginRight: 6 }} />Sign In</>
                )}
              </Button>
            </form>

            <div style={{ marginTop: 20, textAlign: "center", fontSize: 13, color: "#64748b" }}>
              <Link href="/" style={{ color: "#1756C8", textDecoration: "none" }}>← Back to homepage</Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
