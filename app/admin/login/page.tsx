"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, User, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch {
      setError("An unexpected network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="liquid-glass rounded-3xl p-8 max-w-md w-full space-y-6 shadow-xl border border-apple-borderLight dark:border-apple-borderDark">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mx-auto shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">SuperRich Control Center</h1>
          <p className="text-xs text-neutral-500">
            Sign in with administrative credentials to access review queues and pipelines.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-loss/10 text-loss text-xs font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full liquid-glass rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full liquid-glass rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-semibold text-xs hover:opacity-90 transition-opacity flex items-center justify-center space-x-1.5 shadow-sm disabled:opacity-50"
          >
            <span>{loading ? "Authenticating..." : "Sign In to Admin Panel"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center text-[11px] text-neutral-400 pt-2 border-t border-neutral-200/50 dark:border-neutral-800/80">
          Default local credentials: <span className="font-mono text-neutral-600 dark:text-neutral-300">admin / admin123</span>
        </div>
      </div>
    </div>
  );
}
