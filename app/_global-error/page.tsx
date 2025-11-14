import Link from "next/link";

export default function GlobalErrorPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        boxSizing: "border-box",
      }}
    >
      <div style={{ maxWidth: 720, textAlign: "center" }}>
        <h1 style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>
          Oops — Something went wrong
        </h1>
        <p style={{ color: "#555", marginBottom: "1.25rem" }}>
          The app encountered an unexpected error. You can try reloading the
          page or go back to the home page.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={() => location.reload()}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: 6,
              border: "1px solid #ddd",
              background: "white",
              cursor: "pointer",
            }}
          >
            Reload
          </button>

          <Link href="/">
            <a
              style={{
                display: "inline-block",
                padding: "0.6rem 1rem",
                borderRadius: 6,
                background: "#0b61ff",
                color: "white",
                textDecoration: "none",
              }}
            >
              Home
            </a>
          </Link>
        </div>
      </div>
    </main>
  );
}
("use client");

import React from "react";
import Link from "next/link";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error?: Error;
  reset?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-900 p-4">
      <h1 className="text-4xl font-bold mb-4">Something went wrong</h1>
      {error && <p className="mb-4 text-red-600">{error.message}</p>}
      <button
        onClick={() => reset && reset()}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Try Again
      </button>
      <Link href="/" className="mt-4 text-blue-600 hover:underline">
        Go to Home
      </Link>
    </div>
  );
}
