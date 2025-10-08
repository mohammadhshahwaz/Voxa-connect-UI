import "./signup.css";
import React, { useState } from "react";
import { register, persistAuth } from "../../services/auth";

const Signup: React.FC = () => {
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
    const res = await register(email, password);
    setLoading(false);
    if (!res.ok) {
      setError(res.error || "Signup failed");
      return;
    }
    // Optionally persist returned identifiers if any, plus username
    persistAuth({ user_id: res.data.user_id, api_key: res.data.api_key, username: email });
    setMessage(res.data.message || "Account created successfully.");
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-green-600 signup--">
      <div className="w-full max-w-md bg-white signup-form rounded-2xl shadow-lg p-8">
        {/* Title */}
        <h2 className="text-3xl greeting font-bold text-center mb-2">
          Create an account
        </h2>
        {error && (
          <p className="text-red-500 text-sm text-center mb-4" role="alert">{error}</p>
        )}
        {message && (
          <p className="text-green-400 text-sm text-center mb-4">{message}</p>
        )}

        {/* Signup Form */}
        <form className="space-y-5" onSubmit={onSubmit} noValidate>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
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
              placeholder="Create a password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full signup-button py-2 rounded-lg font-bold text-xl transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
