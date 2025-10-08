import "./login.css"


import React, { useState } from "react";
import { login, persistAuth } from "../../services/auth";
import { useNavigate, useLocation } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error || "Login failed");
      return;
    }
    // Persist minimal auth details + username
    persistAuth({ user_id: res.data.user_id, api_key: res.data.api_key, username: email });
    const ok = res.data.is_valid !== false; // default true if not provided
    const next = location?.state?.from?.pathname || "/home";
    if (ok) {
      navigate(next, { replace: true });
      return;
    }
    setMessage(res.data.message || "Login response received.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen  text-green-600 login--">
      <div className="w-full max-w-md bg-white login-form rounded-2xl shadow-lg p-8">
        {/* Title */}
        <h2 className="text-3xl greeting font-bold text-center mb-2">
          Welcome to Login
        </h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4" role="alert">{error}</p>
        )}
        {message && (
          <p className="text-green-400 text-sm text-center mb-4">{message}</p>
        )}

        {/* Login Form */}
        <form className="space-y-5" onSubmit={onSubmit} noValidate>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">User Name</label>
            <input
              type="text"
              placeholder="Enter your Username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full login-button  py-2 rounded-lg font-bold text-xl transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {/* Signup CTA */}
          <div className="text-center text-sm mt-3">
            <span className="text-gray-300">New here?</span>{" "}
            <a href="/signup" className="font-semibold" style={{ color: 'var(--text-dark-hover)' }}>
              Create an account
            </a>
          </div>
        </form>

      
      </div>
    </div>
  );
};

export default Login;
