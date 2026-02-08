import React, { useState } from "react";
import { Camera, Lock, Mail, ArrowRight, User, Chrome } from "lucide-react";
import { GlassCard, Button, Input } from "./UI";
import { useAuthActions } from "@convex-dev/auth/react";

export default function Login({ onLogin }) {
  const { signIn } = useAuthActions();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    upiId: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await signIn("password", {
          email: formData.email,
          password: formData.password,
          flow: "signIn",
        });
      } else {
        await signIn("password", {
          email: formData.email,
          password: formData.password,
          flow: "signUp",
          name: formData.name,
          contact: formData.contact,
          upiId: formData.upiId,
        });
      }
    } catch (err) {
      setError("Authentication failed. Please check your credentials.");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      setError("Google login failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ background: "var(--primary-color)" }}
        ></div>
        <div
          className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{ background: "var(--primary-color)", animationDelay: "1s" }}
        ></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <img
            src="/static/icons/logo.png"
            alt="ShutterSync Logo"
            className="w-24 h-24 mx-auto mb-6 transition-transform hover:scale-110 duration-500 drop-shadow-2xl"
          />
          <p
            className="text-xs uppercase tracking-widest font-bold opacity-60"
            style={{ color: "var(--text-secondary)" }}
          >
            Smart photography simplified
          </p>
        </div>

        <GlassCard className="p-8 md:p-10 shadow-2xl backdrop-blur-3xl">
          {/* Toggle Login/Register */}
          <div
            className="flex p-1 rounded-2xl mb-8"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
            }}
          >
            <button
              onClick={() => setIsLogin(true)}
              className="flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300"
              style={{
                background: isLogin ? "var(--primary-color)" : "transparent",
                color: isLogin ? "var(--bg-main)" : "var(--text-secondary)",
              }}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className="flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300"
              style={{
                background: !isLogin ? "var(--primary-color)" : "transparent",
                color: !isLogin ? "var(--bg-main)" : "var(--text-secondary)",
              }}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label
                  className="text-xs font-bold uppercase tracking-wider ml-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Full Name
                </label>
                <Input
                  icon={User}
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  textOnly
                  maxLength={50}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="space-y-2">
              <label
                className="text-xs font-bold uppercase tracking-wider ml-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Email
              </label>
              <Input
                type="email"
                icon={Mail}
                placeholder="photographer@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-xs font-bold uppercase tracking-wider ml-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Password
              </label>
              <Input
                type="password"
                icon={Lock}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label
                    className="text-xs font-bold uppercase tracking-wider ml-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Contact
                  </label>
                  <Input
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.contact}
                    onChange={(e) =>
                      setFormData({ ...formData, contact: e.target.value })
                    }
                    phoneOnly
                    maxLength={15}
                    required={!isLogin}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    className="text-xs font-bold uppercase tracking-wider ml-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    UPI ID
                  </label>
                  <Input
                    placeholder="photographer@upi"
                    value={formData.upiId}
                    onChange={(e) =>
                      setFormData({ ...formData, upiId: e.target.value })
                    }
                    alphanumericOnly
                    maxLength={255}
                    required={!isLogin}
                  />
                </div>
              </>
            )}

            {error && (
              <div
                className="p-3 rounded-xl"
                style={{
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                <p
                  className="text-xs font-bold text-center"
                  style={{ color: "#ef4444" }}
                >
                  {error}
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-4 font-bold uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all active:scale-95 duration-300"
            >
              <span className="flex items-center justify-center gap-2">
                {loading
                  ? isLogin
                    ? "Signing in..."
                    : "Creating account..."
                  : isLogin
                    ? "Sign In"
                    : "Create Account"}
                <ArrowRight size={16} />
              </span>
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div
              className="flex-1 h-px"
              style={{ background: "var(--card-border)" }}
            ></div>
            <span
              className="text-xs font-bold uppercase"
              style={{ color: "var(--text-secondary)" }}
            >
              Or
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "var(--card-border)" }}
            ></div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-4 rounded-xl font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 duration-300 flex items-center justify-center gap-3"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              color: "var(--text-primary)",
            }}
          >
            <Chrome size={20} />
            Continue with Google
          </button>

          {/* Admin Link */}
          <div
            className="mt-6 pt-6 text-center"
            style={{ borderTop: "1px solid var(--card-border)" }}
          >
            <a
              href="/admin"
              className="text-xs font-bold uppercase tracking-wider hover:underline transition-all"
              style={{ color: "var(--text-secondary)" }}
            >
              Admin Access →
            </a>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
