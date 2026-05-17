"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GraduationCap, Store } from "lucide-react";
import styles from "./page.module.css";

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function selectRole(role: "student" | "merchant") {
    setLoading(true);
    await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    await update({ role });
    router.push(role === "merchant" ? "/dashboard" : "/home");
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome, {session?.user?.name?.split(" ")[0]}!</h1>
      <p className={styles.subtitle}>How will you use EsnafTim?</p>
      <div className={styles.cards}>
        <button className={styles.roleCard} onClick={() => selectRole("student")} disabled={loading}>
          <GraduationCap size={40} />
          <h3>Student</h3>
          <p>Discover merchants, earn loyalty points & get discounts</p>
        </button>
        <button className={styles.roleCard} onClick={() => selectRole("merchant")} disabled={loading}>
          <Store size={40} />
          <h3>Merchant</h3>
          <p>Manage your business, offer discounts & track customers</p>
        </button>
      </div>
    </div>
  );
}