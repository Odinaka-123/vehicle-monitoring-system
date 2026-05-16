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
      setError("Please fill in all fields.");
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
        setError("Invalid username or password.");
        setLoading(false);
        return;
      }
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.orb} ${styles.orb1}`} />
      <div className={`${styles.orb} ${styles.orb2}`} />
      <div className={`${styles.orb} ${styles.orb3}`} />
      <div className={styles.grid} />

      <div className={styles.card}>
        <div className={styles.cardGlow} />
        <div className={styles.cardInner}>
          <div className={styles.topLine} />
          <div className={styles.cardBody}>
            <div className={styles.brandSection}>
              <div className={styles.brandRow}>
                <div className={styles.logoMark}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z"
                      fill="#eab308"
                    />
                    <path
                      d="M9 12l2 2 4-4"
                      stroke="#1a0f00"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className={styles.brandName}>VMS</span>
              </div>
              <div className={styles.brandTagline}>
                Vehicle Monitoring System
              </div>
            </div>

            <div className={styles.statusPill}>
              <span className={styles.statusDot} />
              System operational
            </div>

            <div className={styles.sep} />

            <h1 className={styles.heading}>Welcome back</h1>
            <p className={styles.subheading}>
              Sign in to your account to continue
            </p>

            {error && (
              <div className={styles.errorBanner}>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="#fca5a5"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 8v5M12 16v.5"
                    stroke="#fca5a5"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                {error}
              </div>
            )}

            <div className={styles.fields}>
              <Field
                label="Username"
                type="text"
                placeholder="Enter your username"
                icon="ti-user"
                value={username}
                onChange={setUsername}
                onKeyDown={handleKeyDown}
                autoComplete="username"
              />
              <Field
                label="Password"
                type="password"
                placeholder="••••••••"
                icon="ti-lock"
                value={password}
                onChange={setPassword}
                onKeyDown={handleKeyDown}
                autoComplete="current-password"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ?
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      opacity="0.25"
                    />
                    <path
                      d="M12 2a10 10 0 0 1 10 10"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                  Authenticating...
                </>
              : "Authenticate"}
            </button>

            <div className={styles.footer}>
              <span className={styles.footerItem}>256-bit encrypted</span>
              <span className={styles.footerSep} />
              <span className={styles.footerItem}>Activity monitored</span>
              <span className={styles.footerSep} />
              <span className={styles.footerItem}>Restricted access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  placeholder,
  icon,
  value,
  onChange,
  onKeyDown,
  autoComplete,
}: {
  label: string;
  type: string;
  placeholder: string;
  icon: string;
  value: string;
  onChange: (v: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className={`${styles.fieldWrapper} ${focused ? styles.focused : ""}`}>
      <div className={styles.fieldLabel}>
        <i
          className={`ti ${icon}`}
          aria-hidden="true"
          style={{ fontSize: 13 }}
        />
        {label}
      </div>
      <div className={styles.inputWrap}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <i className={`ti ${icon} ${styles.inputIcon}`} aria-hidden="true" />
      </div>
    </div>
  );
}
