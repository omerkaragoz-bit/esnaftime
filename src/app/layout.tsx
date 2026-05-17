import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import BottomNav from "@/components/BottomNav";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, maximumScale: 1, viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "EsnafTim - Student & Merchant Marketplace",
  description: "Connect with local merchants, earn loyalty points, and discover exclusive student discounts.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <LanguageSwitcher />
          {children}
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}