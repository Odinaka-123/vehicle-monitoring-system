"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./AdminRouteGuard.module.css";

export default function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    setTimeout(() => {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        setAllowed(false);
        return;
      }

      const user = JSON.parse(userStr);
      setAllowed(user.role === "admin");
    }, 0);
  }, []);

  if (allowed === null) {
    return <div className={styles.wrapper}><p className={styles.message}>Checking access...</p></div>;
  }

  if (!allowed) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <h2 className={styles.title}>🚫 Access Denied</h2>
          <p className={styles.message}>
            You are not allowed to view this page. Only admins can access this section.
          </p>
          <button className={styles.button} onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}