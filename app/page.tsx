"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = JSON.parse(user);
      router.push(parsed.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [router]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#060910",
        fontFamily: "'Inter', sans-serif",
        overflow: "hidden",
        position: "relative",
        padding: "2rem 1rem",
      }}
    >
      {/* Orbs */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(234,179,8,0.07)",
          filter: "blur(90px)",
          top: -100,
          left: -100,
          animation: "f1 9s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "rgba(99,102,241,0.06)",
          filter: "blur(90px)",
          bottom: -80,
          right: -80,
          animation: "f2 11s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />

      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.016) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.016) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
          WebkitMaskImage:
            "radial-gradient(ellipse 75% 75% at 50% 50%,black,transparent)",
          maskImage:
            "radial-gradient(ellipse 75% 75% at 50% 50%,black,transparent)",
        }}
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes f1{0%,100%{transform:translate(0,0)}50%{transform:translate(22px,16px)}}
        @keyframes f2{0%,100%{transform:translate(0,0)}50%{transform:translate(-16px,-22px)}}
        @keyframes cardIn{from{opacity:0;transform:translateY(24px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes rotateBorder{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1;box-shadow:0 0 8px #22c55e}50%{opacity:0.5;box-shadow:0 0 14px #22c55e}}
        .vms-card-wrap:hover .vms-glow{opacity:1 !important}
        .vms-btn:hover{transform:translateY(-1px);opacity:0.92}
        .vms-btn:active{transform:scale(0.985)}
      `}</style>

      {/* Card */}
      <div
        className="vms-card-wrap"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "26rem",
          animation: "cardIn 0.7s cubic-bezier(.16,1,.3,1) both",
        }}
      >
        {/* Rotating glow border */}
        <div
          className="vms-glow"
          style={{
            position: "absolute",
            inset: -1,
            borderRadius: 22,
            background:
              "conic-gradient(from 180deg at 50% 50%,transparent 0deg,rgba(234,179,8,0.12) 60deg,transparent 120deg,transparent 360deg)",
            animation: "rotateBorder 7s linear infinite",
            opacity: 0,
            transition: "opacity 0.4s",
          }}
        />

        <div
          style={{
            position: "relative",
            background: "rgba(10,14,26,0.97)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 22,
            overflow: "hidden",
          }}
        >
          {/* Top shimmer line */}
          <div
            style={{
              height: 2,
              background:
                "linear-gradient(90deg,transparent,#ca8a04,#eab308,#fde68a,#eab308,#ca8a04,transparent)",
              backgroundSize: "200% 100%",
              animation: "shimmer 3s linear infinite",
            }}
          />

          <div style={{ padding: "2.25rem 2.25rem 2rem", textAlign: "center" }}>
            {/* Brand */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 11,
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  background:
                    "linear-gradient(135deg,rgba(234,179,8,0.15),rgba(234,179,8,0.05))",
                  border: "1px solid rgba(234,179,8,0.28)",
                  borderRadius: 13,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <ShieldIcon />
              </div>
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#f8fafc",
                  letterSpacing: "-0.01em",
                }}
              >
                VMS
              </span>
            </div>
            <div
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.28)",
                letterSpacing: "0.08em",
                marginBottom: "1.75rem",
              }}
            >
              Vehicle Monitoring System
            </div>

            {/* Separator */}
            <div
              style={{
                height: 1,
                background:
                  "linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent)",
                marginBottom: "1.75rem",
              }}
            />

            {/* Stats */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "1.75rem",
              }}
            >
              {[
                ["24/7", "Monitoring"],
                ["100%", "Encrypted"],
                ["Live", "Analytics"],
              ].map(([val, lbl], i, arr) => (
                <div
                  key={lbl}
                  style={{
                    flex: 1,
                    padding: "0.875rem 0.5rem",
                    textAlign: "center",
                    border: "1px solid rgba(255,255,255,0.06)",
                    background: "rgba(255,255,255,0.02)",
                    borderRight:
                      i < arr.length - 1 ?
                        "none"
                      : "1px solid rgba(255,255,255,0.06)",
                    borderRadius:
                      i === 0 ? "10px 0 0 10px"
                      : i === arr.length - 1 ? "0 10px 10px 0"
                      : "0",
                  }}
                >
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 600,
                      color: "#eab308",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {val}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.3)",
                      letterSpacing: "0.08em",
                      marginTop: 2,
                    }}
                  >
                    {lbl}
                  </div>
                </div>
              ))}
            </div>

            <h1
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#f8fafc",
                letterSpacing: "-0.02em",
                marginBottom: 8,
                lineHeight: 1.3,
              }}
            >
              Intelligent vehicle
              <br />
              access control
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.38)",
                lineHeight: 1.65,
                marginBottom: "1.75rem",
                fontWeight: 400,
              }}
            >
              Monitor entry, manage vehicles, and track incidents across your
              facility in real time.
            </p>

            {/* Status */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                marginBottom: "1.75rem",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#22c55e",
                  display: "inline-block",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.08em",
                }}
              >
                All systems operational
              </span>
            </div>

            {/* CTA button */}
            <button
              className="vms-btn"
              onClick={() => router.push("/login")}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 13,
                fontFamily: "'Inter',sans-serif",
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.04em",
                border: "none",
                cursor: "pointer",
                background:
                  "linear-gradient(135deg,#a16207 0%,#ca8a04 30%,#eab308 65%,#fde68a 100%)",
                color: "#1a0f00",
                transition: "transform 0.15s, opacity 0.15s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg,rgba(255,255,255,0.18) 0%,transparent 55%)",
                  pointerEvents: "none",
                }}
              />
              <ShieldIcon small />
              Access Portal
            </button>

            {/* Features */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginTop: "1.5rem",
              }}
            >
              {[
                {
                  icon: "ti-car",
                  title: "Vehicle Registry",
                  desc: "Register, track and manage all vehicles",
                },
                {
                  icon: "ti-chart-bar",
                  title: "Live Analytics",
                  desc: "Real-time dashboards and incident reports",
                },
                {
                  icon: "ti-shield-lock",
                  title: "Gate Access Control",
                  desc: "Instant grant or deny with audit trail",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 14px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 8,
                      flexShrink: 0,
                      background: "rgba(234,179,8,0.08)",
                      border: "1px solid rgba(234,179,8,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      color: "#eab308",
                    }}
                  >
                    <i className={`ti ${f.icon}`} aria-hidden="true" />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 12.5,
                        color: "rgba(255,255,255,0.75)",
                        fontWeight: 500,
                        marginBottom: 1,
                      }}
                    >
                      {f.title}
                    </div>
                    <div
                      style={{ fontSize: 12, color: "rgba(255,255,255,0.38)" }}
                    >
                      {f.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: "1.5rem",
                paddingTop: "1.25rem",
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {["Secure", "Encrypted", "Activity logged"].map((t, i, a) => (
                <>
                  <span
                    key={t}
                    style={{
                      fontSize: 10,
                      color: "rgba(255,255,255,0.18)",
                      letterSpacing: "0.07em",
                    }}
                  >
                    {t}
                  </span>
                  {i < a.length - 1 && (
                    <span
                      style={{
                        width: 3,
                        height: 3,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.12)",
                        display: "inline-block",
                      }}
                    />
                  )}
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShieldIcon({ small = false }: { small?: boolean }) {
  const s = small ? 16 : 22;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V6L12 2z"
        fill="#eab308"
        opacity={small ? 0.7 : 1}
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="#1a0f00"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
