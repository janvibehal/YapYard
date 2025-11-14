"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../../../context/AuthContext"; 

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

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      setMessage({ type: "success", text: "Logged in successfully!" });
      setTimeout(() => router.push("/"), 1000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Login failed" });
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
    <div className="min-h-screen flex items-center justify-center w-full font-sans" suppressHydrationWarning>
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden md:h-full lg:max-h-[800px] lg:h-[80vh] m-4">
        {/* Left Side Image */}
        <div
          className="relative md:w-1/2 p-8 flex flex-col justify-between bg-cover bg-center rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none min-h-[300px] md:min-h-full"
          style={{
            backgroundImage:
              "url('https://picsum.photos/800/1200?grayscale&blur=1&random=1')",
            backgroundSize: "cover",
          }}
        ></div>

        {/* Right Side Login Form */}
        <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
          <header className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800">
              Welcome Back!
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Please login to your account.
            </p>
          </header>

          <form onSubmit={handleLogin} className="space-y-6 text-gray-400">
            <AuthInput
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              Icon={Mail}
            />
            <AuthInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              Icon={Lock}
            />

            {/* Remember Me and Forgot Password */}
            <div className="flex justify-between items-center text-xs">
              <label className="flex items-center text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-gray-900 shadow-sm focus:border-gray-900 focus:ring focus:ring-gray-900/50 mr-2"
                />
                Remember Me
              </label>
              <a
                href="#"
                className="text-gray-500 hover:text-gray-900 transition duration-150"
              >
                Forgot password?
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-700 transition duration-150 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <Link
                href="/auth/signup"
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition duration-150 text-center"
              >
                Sign up
              </Link>
            </div>
          </form>

          {/* Terms and Conditions */}
          <p className="mt-8 text-center text-xs text-gray-400">
            By logging in, you agree to our terms and privacy policy.
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
