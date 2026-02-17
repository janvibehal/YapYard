"use client";

import { useState, useEffect, useRef, useCallback, ChangeEvent, KeyboardEvent } from "react";
import Link from "next/link";
import { User, Lock, ShieldCheck, LucideIcon } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AuthInputProps {
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  Icon: LucideIcon;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Generates a random N-digit numeric OTP string. */
const generateOTP = (length: number = 6): string =>
  Array.from({ length }, () => Math.floor(Math.random() * 10).toString()).join("");

// ─── Sub-components ───────────────────────────────────────────────────────────

const AuthInput: React.FC<AuthInputProps> = ({ type, placeholder, value, onChange, Icon }) => (
  <div className="relative">
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/60 backdrop-blur-md border border-white/30
                 focus:outline-none focus:ring-2 focus:ring-white/70 text-sm text-gray-800 placeholder-gray-500"
    />
    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
  </div>
);

// ─── OTP Box Component ────────────────────────────────────────────────────────

interface OTPInputProps {
  length?: number;
  value: string[];
  onChange: (digits: string[]) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ length = 6, value, onChange }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const focusBox = (index: number) => {
    if (index >= 0 && index < length) {
      inputRefs.current[index]?.focus();
    }
  };

  const handleChange = (index: number, raw: string) => {
    // Allow only last digit typed (handles paste-like replacements too)
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);
    if (digit && index < length - 1) focusBox(index + 1);
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...value];
      if (next[index]) {
        // Clear current box first
        next[index] = "";
        onChange(next);
      } else if (index > 0) {
        // Move back and clear previous
        next[index - 1] = "";
        onChange(next);
        focusBox(index - 1);
      }
    } else if (e.key === "ArrowLeft") {
      focusBox(index - 1);
    } else if (e.key === "ArrowRight") {
      focusBox(index + 1);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;
    const next = [...value];
    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });
    onChange(next);
    focusBox(Math.min(pasted.length, length - 1));
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          onFocus={(e) => e.target.select()}
          aria-label={`OTP digit ${i + 1}`}
          className={`
            w-11 h-12 text-center text-lg font-semibold rounded-xl
            bg-white/60 backdrop-blur-md border transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-white/80 focus:scale-105
            text-gray-800 caret-transparent
            ${value[i] ? "border-white/70 bg-white/75 shadow-inner" : "border-white/30"}
          `}
        />
      ))}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

const OTP_LENGTH = 6;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP state
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [generatedOTP, setGeneratedOTP] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [showOTPHint, setShowOTPHint] = useState(true); // show for testing; set false in prod

  // Generate OTP once on mount
  useEffect(() => {
    const otp = generateOTP(OTP_LENGTH);
    setGeneratedOTP(otp);
    console.info("[DEV] Generated OTP:", otp);
  }, []);

  const refreshOTP = useCallback(() => {
    const otp = generateOTP(OTP_LENGTH);
    setGeneratedOTP(otp);
    setOtpDigits(Array(OTP_LENGTH).fill(""));
    setOtpError("");
    console.info("[DEV] Refreshed OTP:", otp);
  }, []);

  // True only when every box has a digit
  const otpComplete = otpDigits.every((d) => d !== "");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate OTP
    const enteredOTP = otpDigits.join("");
    if (enteredOTP.length < OTP_LENGTH) {
      setOtpError("Please enter the complete verification code.");
      return;
    }
    if (enteredOTP !== generatedOTP) {
      setOtpError("Incorrect code. Please try again.");
      setOtpDigits(Array(OTP_LENGTH).fill(""));
      return;
    }

    setOtpError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* VIDEO BACKGROUND */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/login-bg.mp4" type="video/mp4" />
      </video>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/30" />

      {/* GLASS CARD */}
      <div className="relative z-10 w-full max-w-4xl mx-4 rounded-3xl
                      bg-white/20 backdrop-blur-sm border border-white/30
                      shadow-[0_8px_32px_rgba(0,0,0,0.25)]
                      flex flex-col md:flex-row overflow-hidden">

        {/* LEFT VISUAL */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-10 text-white">
          <div>
            <h2 className="text-3xl font-semibold mb-3">Welcome Back</h2>
            <p className="text-sm text-white/80">
              Securely access your account and continue where you left off.
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="md:w-1/2 p-8 md:p-12">
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Email */}
            <AuthInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              Icon={User}
            />

            {/* Password */}
            <AuthInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              Icon={Lock}
            />

            {/* ── OTP SECTION ── */}
            <div className="rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md p-5 space-y-4">

              {/* Header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white/90">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-medium">Verification Code</span>
                </div>

                {/* Resend / Refresh button */}
                <button
                  type="button"
                  onClick={refreshOTP}
                  className="text-xs text-white/60 hover:text-white/90 underline underline-offset-2
                             transition-colors duration-150"
                >
                  Resend code
                </button>
              </div>

              {/* DEV HINT — shows generated OTP for testing */}
              {showOTPHint && generatedOTP && (
                <div className="flex items-center justify-between rounded-lg bg-white/10 border border-white/20 px-3 py-2">
                  <span className="text-xs text-white/60 font-mono">Dev preview:</span>
                  <span className="text-sm font-mono font-bold text-white tracking-[0.25em]">
                    {generatedOTP}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowOTPHint(false)}
                    className="text-white/40 hover:text-white/70 text-xs ml-2"
                    aria-label="Dismiss hint"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* OTP Boxes */}
              <OTPInput
                length={OTP_LENGTH}
                value={otpDigits}
                onChange={(digits) => {
                  setOtpDigits(digits);
                  setOtpError("");
                }}
              />

              {/* Inline error */}
              {otpError && (
                <p className="text-center text-xs text-red-300 animate-pulse">
                  {otpError}
                </p>
              )}
            </div>
            {/* ── END OTP SECTION ── */}

            {/* Submit */}
            <button
              type="submit"
              disabled={!otpComplete || loading}
              className={`w-full py-3 rounded-xl font-medium text-white transition-all duration-300
                ${
                  otpComplete
                    ? "bg-orange-500 border border-orange-400 hover:bg-orange-400 shadow-[0_0_18px_rgba(249,115,22,0.45)] hover:shadow-[0_0_26px_rgba(249,115,22,0.6)] cursor-pointer"
                    : "bg-white/20 backdrop-blur-md border border-white/30 opacity-50 cursor-not-allowed"
                }
                disabled:opacity-50`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-sm text-center text-white/80">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="underline hover:text-white">
                Sign up
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}