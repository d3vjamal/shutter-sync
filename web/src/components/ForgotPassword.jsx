import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function ForgotPassword({ onBack }) {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const requestCode = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn("password", { email, flow: "reset" });
      setStep("verify");
    } catch {
      setError("Could not send reset email. Check the address and try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 8) return setError("Password must be at least 8 characters");
    if (!/[A-Z]/.test(newPassword)) return setError("Password must contain at least one uppercase letter");
    if (!/[0-9]/.test(newPassword)) return setError("Password must contain at least one number");
    setLoading(true);
    try {
      // On success this also signs the user in.
      await signIn("password", { email, code, newPassword, flow: "reset-verification" });
    } catch {
      setError("Invalid or expired code. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={step === "request" ? requestCode : resetPassword} className="space-y-4">
      <p className="text-xs text-muted-foreground">
        {step === "request"
          ? "Enter your account email and we'll send you a reset code."
          : `Enter the code sent to ${email} and choose a new password.`}
      </p>

      {step === "request" ? (
        <div className="space-y-2">
          <Label className="text-[10px] uppercase tracking-widest font-bold ml-1 text-muted-foreground">Email</Label>
          <Input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11" required />
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest font-bold ml-1 text-muted-foreground">Reset Code</Label>
            <Input value={code} onChange={(e) => /^[0-9]*$/.test(e.target.value) && setCode(e.target.value)} maxLength={8} className="h-11" required />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest font-bold ml-1 text-muted-foreground">New Password</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="h-11" required />
          </div>
        </>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-secondary/10 border border-secondary/20 rounded-xl">
          <AlertCircle size={14} className="text-secondary" />
          <p className="text-[11px] font-bold text-secondary">{error}</p>
        </div>
      )}

      <Button type="submit" disabled={loading} className="w-full h-12 font-bold rounded-xl">
        {step === "request" ? "Send Reset Code" : "Reset Password"}
      </Button>
      <Button type="button" variant="outline" onClick={onBack} disabled={loading} className="w-full h-12 rounded-xl">
        Back to Sign In
      </Button>
    </form>
  );
}
