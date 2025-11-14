"use client";

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function GlobalErrorPage() {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <h1>Something went wrong!</h1>
      {user && <p>Hello, {user.name}</p>}
    </div>
  );
}
