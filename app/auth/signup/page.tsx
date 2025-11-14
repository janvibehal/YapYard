"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Lock } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";

const AuthInput = ({ type, placeholder, value, onChange, Icon }) => (
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

export default function SignupPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }
    setLoading(true);
    try {
      await register(name, password);
      setMessage({ type: "success", text: "Account created successfully!" });
      setTimeout(() => router.push("/auth/login"), 1500);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Signup failed" });
    } finally {
      setLoading(false);
    }
  };

  const MessageModal = ({ text, type, onClose }) => (
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

  return (
    <div className="min-h-screen flex items-center justify-center w-full font-sans">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden md:h-full lg:max-h-[800px] lg:h-[80vh] m-4">
        {/* Left Side Image */}
        <div
          className="relative md:w-1/2 p-8 flex flex-col justify-between bg-cover bg-center rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none min-h-[300px] md:min-h-full"
          style={{
            backgroundImage:
              "url('https://picsum.photos/800/1200?grayscale&blur=1&random=2')",
            backgroundSize: "cover",
          }}
        ></div>

        {/* Right Side Signup Form */}
        <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <header className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">
              Create Account
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Sign up to start your journey.
            </p>
          </header>

          <form onSubmit={handleSignup} className="space-y-6 text-gray-400">
            <AuthInput
              type="text"
              placeholder="name"
              value={name}
              onChange={(e) => setname(e.target.value)}
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

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-700 transition duration-150 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing up..." : "Sign up"}
              </button>

              <Link
                href="/auth/login"
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition duration-150 text-center"
              >
                Login
              </Link>
            </div>
          </form>

          {/* Terms and Conditions */}
          <p className="mt-8 text-center text-xs text-gray-400">
            By signing up, you agree to our terms and conditions and privacy
            policy.
            <br />
            <a href="#" className="hover:text-gray-700 font-medium">
              Terms & Conditions
            </a>{" "}
            |{" "}
            <a href="#" className="hover:text-gray-700 font-medium">
              Privacy Policy
            </a>
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
