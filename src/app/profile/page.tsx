"use client";
import { useSession, signOut } from "next-auth/react";
import { User, Mail, Shield, LogOut, ChevronRight, Bell, HelpCircle, Info } from "lucide-react";
import styles from "./page.module.css";

export default function ProfilePage() {
  const { data: session } = useSession();

  const menuItems = [
    { icon: Bell, label: "Notifications", action: () => {} },
    { icon: HelpCircle, label: "Help & Support", action: () => {} },
    { icon: Info, label: "About EsnafTim", action: () => {} },
  ];

  return (
    <div className="page">
      <h1 className={styles.title}>Profile</h1>

      <div className={styles.profileCard}>
        <div className={styles.avatar}>
          {session?.user?.image ? (
            <img src={session.user.image} alt="" width={72} height={72} />
          ) : (
            <span>{session?.user?.name?.[0]}</span>
          )}
        </div>
        <h2>{session?.user?.name}</h2>
        <p className={styles.email}>{session?.user?.email}</p>
        <span className={`badge ${session?.user?.role === "merchant" ? "badge-accent" : "badge-primary"}`}>
          {session?.user?.role === "merchant" ? "Merchant" : "Student"}
        </span>
      </div>

      <div className={styles.infoCard}>
        <div className={styles.infoRow}><User size={18} color="var(--primary)" /><span>Name</span><strong>{session?.user?.name}</strong></div>
        <div className={styles.infoRow}><Mail size={18} color="var(--primary)" /><span>Email</span><strong>{session?.user?.email}</strong></div>
        <div className={styles.infoRow}><Shield size={18} color="var(--primary)" /><span>Role</span><strong style={{textTransform:"capitalize"}}>{session?.user?.role}</strong></div>
      </div>

      <div className={styles.menu}>
        {menuItems.map(({ icon: Icon, label, action }) => (
          <button key={label} className={styles.menuItem} onClick={action}>
            <Icon size={18} color="var(--text-secondary)" />
            <span>{label}</span>
            <ChevronRight size={16} color="var(--border)" />
          </button>
        ))}
      </div>

      <button className={styles.logoutBtn} onClick={() => signOut({ callbackUrl: "/" })}>
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  );
}