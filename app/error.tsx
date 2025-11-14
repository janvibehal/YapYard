"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  error: Error;
  reset: () => void;
};

export default function GlobalError({ error, reset }: Props) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to the console (or send to analytics)
    console.error("Global error boundary:", error);
  }, [error]);

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
        <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
          Something went wrong
        </h1>
        <p style={{ color: "#666", marginBottom: "1rem" }}>
          An unexpected error occurred. If the problem persists, try reloading
          or return to the homepage.
        </p>

        <pre
          style={{
            background: "#f8f8f8",
            padding: 12,
            borderRadius: 6,
            color: "#111",
            maxHeight: 160,
            overflow: "auto",
            textAlign: "left",
            marginBottom: 12,
          }}
        >
          {error?.message}
        </pre>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button
            onClick={() => {
              try {
                reset();
              } catch (_) {
                // fallback
                router.refresh();
              }
            }}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Try again
          </button>

          <button
            onClick={() => router.push("/")}
            style={{
              padding: "0.6rem 1rem",
              borderRadius: 6,
              background: "#0b61ff",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Home
          </button>

          <Link href="/">
            <a style={{ display: "none" }}>hidden</a>
          </Link>
        </div>
      </div>
    </main>
  );
}
