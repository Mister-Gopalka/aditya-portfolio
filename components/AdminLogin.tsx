"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Two steps, but only on a device the site has not seen. On a device Aditya
// has already verified, step two never appears.

const field =
  "border border-[#1C0A00]/20 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:border-[#A0281A] text-[#1C0A00]";
const button =
  "bg-[#A0281A] text-white font-medium rounded-xl py-3 text-sm hover:bg-[#8B1F13] transition-colors disabled:opacity-50";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [stage, setStage] = useState<"password" | "code">("password");
  const [sentTo, setSentTo] = useState("");
  const [emailFailed, setEmailFailed] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      body: JSON.stringify({ password }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);

    if (!res.ok) {
      setError(data.error === "Unauthorized" ? "Wrong password." : (data.error ?? "Wrong password."));
      return;
    }

    if (data.needsVerification) {
      setStage("code");
      setSentTo(data.sentTo ?? "");
      setEmailFailed(data.sent === false);
      return;
    }

    // Known device. The session cookie is set; re-render on the server so it
    // fetches the panel — nothing was sent to the browser before this point.
    router.refresh();
  }

  async function submitCode(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");

    const res = await fetch("/api/admin/auth/verify", {
      method: "POST",
      body: JSON.stringify({ password, code, name: deviceName }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);

    if (!res.ok) {
      setError(data.error ?? "That code did not work.");
      return;
    }

    router.refresh();
  }

  if (stage === "code") {
    return (
      <div className="rounded-2xl p-8 bg-[#FFF8F3] border border-[#1C0A00]/10 shadow-md max-w-sm">
        <h2 className="font-heading text-xl font-bold text-[#1C0A00] mb-2">
          Verify this device
        </h2>

        {emailFailed ? (
          <p className="text-sm text-[#A0281A] mb-6 leading-relaxed">
            The code could not be emailed. Run{" "}
            <code className="bg-[#1C0A00]/8 rounded px-1">npm run devices code</code> on
            your laptop to get one.
          </p>
        ) : (
          <p className="text-sm text-[#1C0A00]/60 mb-6 leading-relaxed">
            A six-digit code was sent to {sentTo || "your email"}. It expires in ten
            minutes. Once verified, this device will not ask again.
          </p>
        )}

        <form onSubmit={submitCode} className="flex flex-col gap-4">
          <input
            autoFocus
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`${field} tracking-[0.4em] text-center text-lg`}
          />
          <input
            type="text"
            placeholder="Name this device (optional)"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            className={field}
          />
          {error && <p className="text-[#A0281A] text-sm">{error}</p>}
          <button type="submit" disabled={busy} className={button}>
            {busy ? "Verifying…" : "Verify and sign in"}
          </button>
          <button
            type="button"
            onClick={() => {
              setStage("password");
              setCode("");
              setError("");
            }}
            className="text-xs text-[#1C0A00]/40 hover:text-[#1C0A00]/70 transition-colors"
          >
            Start over
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-8 bg-[#FFF8F3] border border-[#1C0A00]/10 shadow-md max-w-sm">
      <h2 className="font-heading text-xl font-bold text-[#1C0A00] mb-6">Enter password</h2>
      <form onSubmit={submitPassword} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={field}
        />
        {error && <p className="text-[#A0281A] text-sm">{error}</p>}
        <button type="submit" disabled={busy} className={button}>
          {busy ? "Checking…" : "Enter"}
        </button>
      </form>
    </div>
  );
}
