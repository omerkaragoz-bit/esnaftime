"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, MapPin, Wallet, User, LayoutDashboard } from "lucide-react";
import { useSession } from "next-auth/react";
import styles from "./BottomNav.module.css";

const studentLinks = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/map", icon: MapPin, label: "Map" },
  { href: "/wallet", icon: Wallet, label: "Wallet" },
  { href: "/profile", icon: User, label: "Profile" },
];

const merchantLinks = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/map", icon: MapPin, label: "Map" },
  { href: "/profile", icon: User, label: "Profile" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  if (!session || pathname === "/" || pathname === "/onboarding") return null;
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