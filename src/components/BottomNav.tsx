"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, MapPin, Wallet, User, LayoutDashboard } from "lucide-react";
import { useSession } from "next-auth/react";
import { useLanguage } from "@/lib/LanguageContext";
import styles from "./BottomNav.module.css";

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { t } = useLanguage();

  if (!session || pathname === "/" || pathname === "/onboarding") return null;

  const studentLinks = [
    { href: "/home", icon: Home, label: t("nav_home") },
    { href: "/map", icon: MapPin, label: t("nav_map") },
    { href: "/wallet", icon: Wallet, label: t("nav_wallet") },
    { href: "/profile", icon: User, label: t("nav_profile") },
  ];

  const merchantLinks = [
    { href: "/dashboard", icon: LayoutDashboard, label: t("nav_dashboard") },
    { href: "/map", icon: MapPin, label: t("nav_map") },
    { href: "/profile", icon: User, label: t("nav_profile") },
  ];

  const links = session.user.role === "merchant" ? merchantLinks : studentLinks;

  return (
    <nav className={styles.nav}>
      {links.map(({ href, icon: Icon, label }) => (
        <Link key={href} href={href} className={`${styles.link} ${pathname === href ? styles.active : ""}`}>
          <Icon size={22} strokeWidth={pathname === href ? 2.5 : 1.8} />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}