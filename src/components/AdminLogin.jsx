import React, { useState } from "react";
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
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
import { useNavigate } from "react-router-dom";
import { cn } from "../lib/utils";

export default function AdminLogin({ onLogin, loading: externalLoading }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }
    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number");
      return;
    }

    setLoading(true);
    try {
      await onLogin(email, password, "admin");
    } catch (err) {
      setError("Invalid admin credentials. Please check your details and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="text-center space-y-4">
          <div className="inline-block p-4 ">
            <img
              src="/static/icons/logo.png"
              alt="ShutterSync Logo"
              className="w-24 h-24 transition-transform hover:scale-110 duration-500 drop-shadow-2xl"
            />{" "}
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">
              Admin Portal
            </h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Restricted Supervisory Access
            </p>
          </div>
        </div>

        <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-xl transition-all">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-bold ml-1 text-muted-foreground">
                  Admin Identity
                </Label>
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="admin@shuttersync.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest font-bold ml-1 text-muted-foreground">
                  Secure Password
                </Label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12"
                    required
                  />
                  <Lock
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-secondary/10 border border-secondary/20 rounded-xl mt-2 animate-in fade-in zoom-in-95 duration-200">
                  <AlertCircle size={14} className="text-secondary" />
                  <p className="text-[11px] font-bold text-secondary">
                    {error}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                variant="destructive"
                disabled={loading || externalLoading}
                className="w-full h-14 mt-4 font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] uppercase tracking-widest text-[10px] gap-2"
              >
                {loading || externalLoading ? (
                  "Authenticating..."
                ) : (
                  <>
                    Access Admin Panel
                    <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="pt-4 pb-8 flex justify-center border-t mt-4">
            <button
              onClick={() => navigate("/")}
              className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
            >
              ← Back to main portal
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
