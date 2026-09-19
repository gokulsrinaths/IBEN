"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError("");
    const body = new FormData();
    body.set("password", password);
    const res = await fetch("/api/admin/login", { method: "POST", body });
    setPending(false);
    if (res.ok) {
      router.push("/admin/submissions");
      router.refresh();
    } else if (res.status === 503) {
      setError("Admin login is not configured yet.");
    } else {
      setError("Incorrect password.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--paper)",
      }}
    >
      <form
        onSubmit={submit}
        style={{ width: 320, display: "flex", flexDirection: "column", gap: 16 }}
      >
        <h1 style={{ fontSize: 22, fontFamily: "var(--font-serif)" }}>IBEN Admin</h1>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
          />
        </label>
        {error && (
          <p role="alert" className="status-message error">
            {error}
          </p>
        )}
        <button type="submit" className="button button-dark" disabled={pending}>
          {pending ? "Checking..." : "Log in"}
        </button>
      </form>
    </div>
  );
}
