"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, ShieldCheck, AlertCircle, Lock, Mail, KeyRound, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const [email, setEmail] = useState("anubhavbhrt@gmail.com");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSetupRequired, setIsSetupRequired] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  // Check auth and setup status on mount
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/admin/auth");
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            router.push(from);
            return;
          }
          if (data.setupRequired) {
            setIsSetupRequired(true);
          }
        }
      } catch {
        // Fallback to standard login
      } finally {
        setCheckingStatus(false);
      }
    }
    checkStatus();
  }, [router, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSetupRequired) {
        if (password.length < 8) {
          throw new Error("Password must be at least 8 characters long.");
        }
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match.");
        }

        const res = await fetch("/api/admin/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "setup",
            email,
            password,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to set admin password.");
        }

        router.push(from);
        router.refresh();
        return;
      }

      // Standard Login
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid email or password.");
      }

      router.push(from);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <Card variant="bordered" padding="lg" className="bg-[#14141A] border-[#252532] text-center text-xs text-[#707082]">
        Checking security authorization...
      </Card>
    );
  }

  return (
    <Card variant="bordered" padding="lg" className="bg-[#14141A] border-[#252532] text-white">
      {isSetupRequired && (
        <div className="mb-4 p-3 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-amber-200 text-xs font-semibold flex items-start gap-2">
          <KeyRound className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-white">First-Time Setup Required</p>
            <p className="text-[11px] text-[#A2A2B0] font-normal mt-0.5">
              No password has been configured yet. Set your private admin password below to activate control center access.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-[#7F1D1D]/20 border border-[#7F1D1D]/40 text-[#FECDD3] text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-[#A2A2B0] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Admin Email</span>
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="anubhavbhrt@gmail.com"
            required
            autoComplete="email"
            readOnly={true}
            className="bg-[#0B0B0E] border-[#252532] text-white focus:border-[#F59E0B] opacity-90 cursor-not-allowed"
          />
          <p className="mt-1 text-[11px] text-[#707082]">
            Sole authorized administrator account.
          </p>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#A2A2B0] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{isSetupRequired ? "Create Admin Password" : "Admin Password"}</span>
          </label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isSetupRequired ? "Choose at least 8 characters" : "Enter your admin password"}
            required
            minLength={8}
            autoComplete={isSetupRequired ? "new-password" : "current-password"}
            className="bg-[#0B0B0E] border-[#252532] text-white focus:border-[#F59E0B]"
          />
        </div>

        {isSetupRequired && (
          <div>
            <label className="block text-xs font-bold text-[#A2A2B0] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Confirm Password</span>
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              minLength={8}
              autoComplete="new-password"
              className="bg-[#0B0B0E] border-[#252532] text-white focus:border-[#F59E0B]"
            />
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          className="w-full mt-2"
          icon={<ArrowRight className="w-4 h-4" />}
        >
          {isSetupRequired ? "Set Password & Enter Admin" : "Log In to Control Center"}
        </Button>
      </form>
    </Card>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0E] flex flex-col justify-center items-center p-4 selection:bg-[#F59E0B] selection:text-[#0B0B0E]">
      <div className="w-full max-w-sm space-y-6">
        {/* Creator Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-full ring-2 ring-[#F59E0B] mx-auto overflow-hidden bg-[#1E1E26] shadow-lg mb-3">
            <Image
              src="/images/anubhav.png"
              alt="Anubhav Bharti"
              width={64}
              height={64}
              className="w-full h-full object-cover object-top"
            />
          </div>
          <h1 className="text-xl font-black text-white tracking-tight">
            Creator Admin Portal
          </h1>
          <p className="text-xs text-[#A2A2B0]">
            Anubhav Bharti · Protected workspace for VedxLabs
          </p>
        </div>

        <Suspense
          fallback={
            <Card variant="bordered" padding="lg" className="bg-[#14141A] border-[#252532] text-center text-xs text-[#707082]">
              Loading login portal...
            </Card>
          }
        >
          <LoginForm />
        </Suspense>

        {/* Security Notice */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#707082]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
          <span>Encrypted Session · Restricted to anubhavbhrt@gmail.com</span>
        </div>
      </div>
    </div>
  );
}
