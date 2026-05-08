import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, KeyRound, CreditCard, Smartphone, IdCard, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TiltCard } from "@/components/ui/Card";
import { FloatingInput } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/toast/ToastProvider";
import type { ReactNode } from "react";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Tabs } from "@/components/ui/Tabs";
import { useAuth } from "@/hooks/useAuth";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/;

export function AuthPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { push } = useToast();

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (email && !EMAIL_REGEX.test(email.trim())) e.email = "Enter a valid email address.";
    if (mode === "register" && password && !STRONG_PASSWORD_REGEX.test(password)) {
      e.password = "Password must be 8+ chars with uppercase, lowercase, number, and special character.";
    }
    if (mode === "register" && name && name.trim().length < 2) e.name = "Enter your full name.";
    if (mode === "register" && phone && !/^\d{10}$/.test(phone)) e.phone = "Enter a valid 10-digit phone number.";
    if (mode === "register" && confirmPassword && confirmPassword !== password) e.confirmPassword = "Passwords do not match.";
    return e;
  }, [confirmPassword, email, mode, name, password, phone]);

  const checklist = useMemo(() => {
    const p = password || "";
    return {
      len: p.length >= 8,
      upper: /[A-Z]/.test(p),
      lower: /[a-z]/.test(p),
      num: /\d/.test(p),
      special: /[@$!%*?&.#_-]/.test(p)
    };
  }, [password]);

  return (
    <AppShell>
      <div className="grid min-h-[calc(100vh-6.5rem)] grid-cols-1 gap-6 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-10">
        <motion.section
          initial={{ opacity: 0, x: -12, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative overflow-hidden rounded-2xl p-6 shadow-soft sm:p-8"
        >
          <div className="absolute -left-32 top-12 h-72 w-72 rounded-full bg-[#D4DE95]/50 blur-[80px]" />
          <div className="absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#BAC095]/55 blur-[90px]" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white shadow-soft">
              <Sparkles className="h-4 w-4 text-white" />
              Calm, premium experience
            </div>
            <div className="mt-5 font-display text-4xl font-extrabold tracking-tight text-white">
              Sign in to <span className="text-white">FindAndLost</span>
            </div>
            <div className="mt-2 max-w-xl text-sm text-white">
              A mossy-green lost & found platform with privacy-first messaging, claim requests, and smart matching.
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <FeatureCard icon={<Smartphone className="h-5 w-5" />} title="Fast reporting" note="Lost / Found in seconds" />
              <FeatureCard icon={<ShieldCheck className="h-5 w-5" />} title="Safer claims" note="Verify before meeting" />
              <FeatureCard icon={<CreditCard className="h-5 w-5" />} title="Better matching" note="Category + location hints" />
              <FeatureCard icon={<IdCard className="h-5 w-5" />} title="Private details" note="Sensitive info stays protected" />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2 text-xs font-semibold text-white">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 shadow-soft">
                <KeyRound className="h-4 w-4 text-white" /> One account, all your reports
              </span>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, x: 12, filter: "blur(10px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center"
        >
          <div className="w-full">
            <TiltCard className="p-5 sm:p-6">
              <Tabs
                value={mode}
                onChange={(v) => setMode(v as "login" | "register")}
                tabs={[
                  { value: "login", label: "Login" },
                  { value: "register", label: "Register" }
                ]}
              />

              <motion.div
                key={mode}
                initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 space-y-3"
              >
                {mode === "register" ? (
                  <div className="grid gap-3 md:grid-cols-2">
                    <FloatingInput label="Full name" value={name} onChange={setName} error={errors.name} autoComplete="name" />
                    <FloatingInput
                      label="Phone (10 digits)"
                      value={phone}
                      onChange={(v) => setPhone(v.replace(/[^\d]/g, "").slice(0, 10))}
                      error={errors.phone}
                      autoComplete="tel"
                    />
                  </div>
                ) : null}
                <FloatingInput label="Email" value={email} onChange={setEmail} error={errors.email} autoComplete="email" />
                <PasswordInput
                  label="Password"
                  value={password}
                  onChange={setPassword}
                  error={errors.password}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
                {mode === "register" ? (
                  <>
                    <PasswordInput
                      label="Confirm password"
                      value={confirmPassword}
                      onChange={setConfirmPassword}
                      error={errors.confirmPassword}
                      autoComplete="new-password"
                    />
                    <div className="glass rounded-2xl p-4 shadow-soft">
                      <div className="text-xs font-semibold uppercase tracking-wider text-white">Password checklist</div>
                      <div className="mt-3 grid gap-2 text-xs text-white">
                        <ChecklistRow ok={checklist.len} label="8 characters minimum" />
                        <ChecklistRow ok={checklist.upper} label="One uppercase letter" />
                        <ChecklistRow ok={checklist.lower} label="One lowercase letter" />
                        <ChecklistRow ok={checklist.num} label="One number" />
                        <ChecklistRow ok={checklist.special} label="One special character (@$!%*?&.#_-)" />
                      </div>
                    </div>
                  </>
                ) : null}

                <div className="pt-2">
                  <Button
                    className="w-full"
                    disabled={
                      loading ||
                      Object.keys(errors).length > 0 ||
                      !email ||
                      !password ||
                      (mode === "register" &&
                        (!name || !phone || !confirmPassword || confirmPassword !== password || !STRONG_PASSWORD_REGEX.test(password)))
                    }
                    onClick={async () => {
                      try {
                        setLoading(true);
                        if (mode === "login") await login(email, password);
                        else await register({ name, email, password, phone: phone || undefined });
                        const next = typeof router.query.next === "string" ? router.query.next : "/dashboard";
                        push({ type: "success", title: mode === "login" ? "Logged in" : "Account created" });
                        router.replace(next);
                      } catch (e: any) {
                        push({ type: "warning", title: "Authentication failed", message: e?.message || "Please try again." });
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    <span className="inline-flex items-center justify-center gap-2">
                      {loading ? (mode === "register" ? "Creating your account…" : "Signing you in…") : mode === "login" ? "Login" : "Create account"}
                      <ArrowRight className="h-5 w-5" />
                    </span>
                  </Button>
                </div>

                <div className="text-center text-xs text-white">
                  Continue to{" "}
                  <Link className="font-semibold text-white hover:underline" href="/dashboard">
                    Dashboard
                  </Link>
                </div>
              </motion.div>
            </TiltCard>
          </div>
        </motion.section>
      </div>
    </AppShell>
  );
}

function FeatureCard({ icon, title, note }: { icon: ReactNode; title: string; note: string }) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ type: "spring", stiffness: 320, damping: 26 }} className="glass rounded-2xl p-4 shadow-soft hover:shadow-glow">
      <div className="flex items-start gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="font-display text-sm font-extrabold tracking-tight text-white">{title}</div>
          <div className="mt-1 text-xs text-white">{note}</div>
        </div>
      </div>
    </motion.div>
  );
}

function ChecklistRow({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2">
      <span className="text-white">{label}</span>
      <span className="text-white">{ok ? "✓" : "—"}</span>
    </div>
  );
}
