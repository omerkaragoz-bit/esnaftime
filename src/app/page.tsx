"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "./page.module.css";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push(session.user.role === "merchant" ? "/dashboard" : "/home");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className={styles.loader}>
        <div className={styles.spinner} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div className={styles.logoCircle}>
          <span className={styles.logoIcon}>E</span>
        </div>
        <h1 className={styles.title}>EsnafTim</h1>
        <p className={styles.subtitle}>Discover local merchants, earn points, unlock discounts</p>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>🏪</span>
          <div>
            <strong>Local Merchants</strong>
            <p>Find the best shops near campus</p>
          </div>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>⭐</span>
          <div>
            <strong>Loyalty Points</strong>
            <p>Visit & earn rewards every time</p>
          </div>
        </div>
        <div className={styles.feature}>
          <span className={styles.featureIcon}>💰</span>
          <div>
            <strong>Student Discounts</strong>
            <p>Exclusive deals just for you</p>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button onClick={() => signIn("google")} className={styles.googleBtn}>
          <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.9 33.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.4 15.5 18.8 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34 6 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.4 35.1 26.8 36 24 36c-5.4 0-9.9-3.5-11.5-8.3l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.7-.4-3.9z"/></svg>
          Sign in with Google
        </button>
        <p className={styles.terms}>By signing in, you agree to our Terms of Service</p>
      </div>
    </div>
  );
}