"use client";
import { useSession, signOut } from "next-auth/react";
import { User, Mail, Shield, Bell, Settings, LogOut, HelpCircle, Info } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import styles from "./page.module.css";

export default function ProfilePage() {
  const { data: session } = useSession();
  const { t } = useLanguage();

  if (!session) return null;

  return (
    <div className="page">
      <h1 className={styles.title}>{t("profile_title")}</h1>

      <div className={styles.header}>
        <div className={styles.avatar}>
          {session.user.image ? <img src={session.user.image} alt="" /> : <span>{session.user.name?.[0]}</span>}
        </div>
        <div className={styles.info}>
          <h2>{session.user.name}</h2>
          <span className={styles.roleBadge}>{session.user.role}</span>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.item}><User size={18} color="var(--primary)" /><div><small>{t("profile_name")}</small><p>{session.user.name}</p></div></div>
        <div className={styles.divider} />
        <div className={styles.item}><Mail size={18} color="var(--primary)" /><div><small>{t("profile_email")}</small><p>{session.user.email}</p></div></div>
        <div className={styles.divider} />
        <div className={styles.item}><Shield size={18} color="var(--primary)" /><div><small>{t("profile_role")}</small><p className={styles.capitalize}>{session.user.role}</p></div></div>
      </div>

      <div className={styles.section}>
        <button className={styles.actionBtn}><Bell size={18} /> {t("profile_notif")}</button>
        <div className={styles.divider} />
        <button className={styles.actionBtn}><HelpCircle size={18} /> {t("profile_help")}</button>
        <div className={styles.divider} />
        <button className={styles.actionBtn}><Info size={18} /> {t("profile_about")}</button>
      </div>

      <button className={styles.logoutBtn} onClick={() => signOut({ callbackUrl: "/" })}>
        <LogOut size={18} /> {t("profile_logout")}
      </button>
    </div>
  );
}