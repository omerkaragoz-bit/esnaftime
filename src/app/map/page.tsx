"use client";
import { useLanguage } from "@/lib/LanguageContext";
import styles from "./page.module.css";

export default function MapPage() {
  const { t } = useLanguage();
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("map_view")}</h1>
      <div className={styles.mapContainer}>
        <div className={styles.placeholder}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <p>{t("map_placeholder")}</p>
        </div>
      </div>
      <div className={styles.list}>
        <h2>{t("map_nearby")}</h2>
        <div className={styles.skeleton} />
        <div className={styles.skeleton} />
        <div className={styles.skeleton} />
      </div>
    </div>
  );
}