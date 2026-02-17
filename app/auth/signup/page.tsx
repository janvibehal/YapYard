"use client";

import { useState, ChangeEvent } from "react";
import Link from "next/link";
import { User, Lock, LucideIcon } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";

interface AuthInputProps {
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  Icon: LucideIcon;
}

const AuthInput: React.FC<AuthInputProps> = ({
  type,
  placeholder,
  value,
  onChange,
  Icon,
}) => (
  <div className="relative">
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 transition duration-150 text-sm"
    />
    <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
  </div>
);

interface MessageModalProps {
  text: string;
  type: "success" | "error";
  onClose: () => void;
}

const MessageModal: React.FC<MessageModalProps> = ({ text, type, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
    <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full">
      <h3
        className={`text-lg font-bold ${
          type === "success" ? "text-green-600" : "text-red-600"
        } mb-3`}
      >
        {type === "success" ? "Success" : "Error"}
      </h3>
      <p className="text-gray-700 text-sm mb-4">{text}</p>
      <button
        onClick={onClose}
        className="w-full py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition duration-150"
      >
        Close
      </button>
    </div>
  </div>
);

export default function SignupPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  // Orange button unlocks only when every field has content
  const formComplete =
    name.trim() !== "" &&
    email.trim() !== "" &&
    password !== "" &&
    confirmPassword !== "";

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      setMessage({ type: "success", text: "Account created successfully!" });
      setTimeout(() => router.push("/auth/login"), 1500);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Signup failed" });
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

      {/* MAIN CONTAINER */}
      <div
        className="relative z-10 flex flex-col md:flex-row w-full max-w-5xl
                    bg-white/20 backdrop-blur-2xl border border-white/30
                    rounded-3xl shadow-2xl overflow-hidden
                    md:h-full lg:max-h-[800px] lg:h-[80vh] m-4"
      >
        {/* LEFT VISUAL (optional text area) */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-10 text-white">
          <div>
            <h2 className="text-3xl font-semibold mb-3">Join Us</h2>
            <p className="text-sm text-white/80">
              Create your account and start your journey today.
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <header className="mb-8 text-white">
            <h2 className="text-2xl font-semibold">Create Account</h2>
            <p className="text-sm text-white/80 mt-1">
              Sign up to start your journey.
            </p>
          </header>

          <form onSubmit={handleSignup} className="space-y-6">
            <AuthInput
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              Icon={User}
            />

            <AuthInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              Icon={User}
            />

            <AuthInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              Icon={Lock}
            />

            <AuthInput
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              Icon={Lock}
            />

            <div className="flex gap-4">
              {/* Sign up — orange when all fields filled, muted otherwise */}
              <button
                type="submit"
                disabled={!formComplete || loading}
                className={`flex-1 py-3 px-4 font-medium rounded-xl text-white transition-all duration-300
                  ${
                    formComplete
                      ? "bg-orange-500 border border-orange-400 hover:bg-orange-400 shadow-[0_0_18px_rgba(249,115,22,0.45)] hover:shadow-[0_0_26px_rgba(249,115,22,0.6)] cursor-pointer"
                      : "bg-white/20 backdrop-blur-md border border-white/30 opacity-50 cursor-not-allowed"
                  }`}
              >
                {loading ? "Signing up..." : "Sign up"}
              </button>

              <Link
                href="/auth/login"
                className="flex-1 py-3 px-4 border border-white/30 text-white
                         font-medium rounded-xl hover:bg-white/10 transition text-center"
              >
                Login
              </Link>
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-white/70">
            By signing up, you agree to our terms and conditions and privacy
            policy.
          </p>
        </div>
      </div>

      {message && (
        <MessageModal
          text={message.text}
          type={message.type}
          onClose={() => setMessage(null)}
        />
      )}
    </div>
  );
}