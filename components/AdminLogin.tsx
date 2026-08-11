"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      body: JSON.stringify({ password }),
      headers: { "Content-Type": "application/json" },
    });

    setBusy(false);

    if (res.ok) {
      // The session cookie is set. Re-render the page on the server so it
      // fetches the inbox — nothing was sent to the browser before this point.
      router.refresh();
    } else {
      setError("Wrong password.");
    }
  }

  return (
    <div className="rounded-2xl p-8 bg-[#FFF8F3] border border-[#1C0A00]/10 shadow-md max-w-sm">
      <h2 className="font-heading text-xl font-bold text-[#1C0A00] mb-6">Enter password</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-[#1C0A00]/20 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#A0281A] text-[#1C0A00]"
        />
        {error && <p className="text-[#A0281A] text-sm">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="bg-[#A0281A] text-white font-medium rounded-xl py-3 text-sm hover:bg-[#8B1F13] transition-colors disabled:opacity-50"
        >
          {busy ? "Checking…" : "Enter"}
        </button>
      </form>
    </div>
  );
}
