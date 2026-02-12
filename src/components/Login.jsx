import React, { useState } from "react";
import {
  Camera,
  Lock,
  Mail,
  ArrowRight,
  User,
  Phone,
  Wallet,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "./ui/card";
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width="20"
      height="20"
      viewBox="0 0 48 48"
    >
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      ></path>
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      ></path>
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      ></path>
    </svg>
  );
}

export default function Login({ onLogin }) {
  const { signIn } = useAuthActions();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validationRules = {
    textOnly: (value) => /^[a-zA-Z\s]*$/.test(value),
    numberOnly: (value) => /^[0-9]*$/.test(value),
    phone: (value) => /^[0-9]*$/.test(value),
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    alphanumeric: (value) => /^[a-zA-Z0-9_-]*$/.test(value),
  };

  const handleInputChange = (field, value, type = null) => {
    if (type === "textOnly" && !validationRules.textOnly(value)) return;
    if (type === "numberOnly" && !validationRules.numberOnly(value)) return;
    if (type === "phone" && !validationRules.phone(value)) return;
    if (type === "alphanumeric" && !validationRules.alphanumeric(value)) return;

    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!isLogin && (!formData.name || !formData.contact)) {
      setError("Please fill in all required fields for registration.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!/[A-Z]/.test(formData.password)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }
    if (!/[0-9]/.test(formData.password)) {
      setError("Password must contain at least one number");
      return;
    }

    if (!isLogin && formData.contact.replace(/\D/g, "").length !== 10) {
      setError("Contact number must be exactly 10 digits");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn("password", {
          email: formData.email,
          password: formData.password,
          flow: "signIn",
        });
      } else {
        const signupPayload = {
          email: formData.email,
          password: formData.password,
          flow: "signUp",
          name: formData.name,
        };

        await signIn("password", signupPayload);

        if (typeof window !== "undefined") {
          const pendingFields = {
            contact: formData.contact,
          };
          sessionStorage.setItem(
            "pendingUserFields",
            JSON.stringify(pendingFields),
          );
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      const errorMsg =
        err?.message || err?.toString() || "Authentication failed";

      if (errorMsg.includes("Invalid email")) {
        setError("Invalid email address.");
      } else if (errorMsg.includes("password")) {
        setError("Invalid password. Please try again.");
      } else if (errorMsg.includes("email")) {
        setError("Email not found. Please check or register a new account.");
      } else if (errorMsg.includes("already exists")) {
        setError("This email is already registered. Please log in instead.");
      } else {
        setError(errorMsg || "Authentication failed. Please try again.");
      }
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      console.error("Google login error:", error);
      setError("Google login failed. Please try again or use email/password.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center space-y-4">
          <div className="inline-block p-4  mb-2">
            <img
              src="/static/icons/logo.png"
              alt="ShutterSync Logo"
              className="w-24 h-24 transition-transform hover:scale-110 duration-500 drop-shadow-2xl"
            />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-optical-sizing-auto font-weight:400  tracking-[0.2em] font-family: 'Passions Conflict', cursive">
              Smart photography simplified
            </p>
          </div>
        </div>

        <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-xl">
          <CardHeader className="pb-8">
            <div className="flex p-1 bg-muted rounded-xl">
              <button
                onClick={() => setIsLogin(true)}
                className={cn(
                  "flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                  isLogin
                    ? "bg-background text-secondary shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={cn(
                  "flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all",
                  !isLogin
                    ? "bg-background text-secondary shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Register
              </button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-bold ml-1 text-muted-foreground">
                    Full Name
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value, "textOnly")
                      }
                      className="pl-10 h-11"
                      required={!isLogin}
                    />
                    <User
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-secondary"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-bold ml-1 text-muted-foreground">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10 h-11"
                    required
                  />
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-secondary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-bold ml-1 text-muted-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10 h-11"
                    required
                  />
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-secondary"
                  />
                </div>
                {!isLogin && (
                  <p className="text-[9px] text-muted-foreground/60 ml-1">
                    Min 8 chars, 1 uppercase, 1 number
                  </p>
                )}
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest font-bold ml-1 text-muted-foreground">
                    Contact
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter mobile"
                      value={formData.contact}
                      onChange={(e) =>
                        handleInputChange("contact", e.target.value, "phone")
                      }
                      className="pl-10 h-11"
                      required={!isLogin}
                      maxLength={10}
                    />
                    <Phone
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-secondary"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 p-3 bg-secondary/10 border border-secondary/20 rounded-xl mt-2">
                  <AlertCircle size={14} className="text-secondary" />
                  <p className="text-[11px] font-bold text-secondary">
                    {error}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-4 font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {isLogin ? "Sign In" : "Get Started"}
                    <ArrowRight size={16} />
                  </span>
                )}
              </Button>
            </form>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                <span className="bg-card px-4 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              disabled={loading}
              onClick={handleGoogleLogin}
              className="w-full h-12 rounded-xl border-muted bg-card hover:bg-muted font-bold flex items-center gap-3 transition-all active:scale-[0.98]"
            >
              <GoogleIcon />
              Google
            </Button>
          </CardContent>

          <CardFooter className="pt-4 pb-8 flex justify-center">
            <button
              onClick={() => navigate("/admin")}
              className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              Admin Portal Access <ArrowRight size={12} />
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
