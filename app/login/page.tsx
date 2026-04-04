"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError("Invalid username or password");
        setLoading(false);
        return;
      }

      // Save user session in localStorage (optional)
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }

    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again later.");
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.glow} />
      <div className={styles.card}>
        <div className={styles.accentBar} />
        <div className={styles.cardBody}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.brandRow}>
              <ShieldIcon />
              <span className={styles.brandName}>VMS</span>
            </div>
            <p className={styles.brandSub}>Vehicle Management System</p>
          </div>

          <h2 className={styles.heading}>Sign in</h2>
          <p className={styles.subheading}>Authorized personnel only</p>

          {/* Error */}
          {error && (
            <div className={styles.errorBanner}>
              <AlertIcon />
              {error}
            </div>
          )}

          {/* Fields */}
          <div className={styles.fields}>
            <Field
              label="Username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={setUsername}
              onKeyDown={handleKeyDown}
              autoComplete="username"
            />
            <Field
              label="Password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={setPassword}
              onKeyDown={handleKeyDown}
              autoComplete="current-password"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className={styles.submitBtn}
          >
            {loading ? (
              <>
                <SpinnerIcon /> Authenticating...
              </>
            ) : (
              "Authenticate"
            )}
          </button>

          <p className={styles.footerNote}>
            Access restricted · All activity logged
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Field component ── */
function Field({ label, type, placeholder, value, onChange, onKeyDown, autoComplete } : {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className={`${styles.fieldWrapper} ${focused ? styles.focused : ""}`}>
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        {...(autoComplete && { autoComplete })}
        onChange={e => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

/* ── Icons ── */
function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z" fill="#f59e0b" opacity="0.9" />
      <path d="M9 12l2 2 4-4" stroke="#0a0f1e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="#fca5a5" strokeWidth="1.5" />
      <path d="M12 8v5M12 16v.5" stroke="#fca5a5" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}