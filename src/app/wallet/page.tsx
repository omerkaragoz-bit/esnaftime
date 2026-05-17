"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Award, TrendingUp, Zap } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import styles from "./page.module.css";

const tierColors: Record<string, string> = { bronze: "#CD7F32", silver: "#A0A0A0", gold: "#FFD700", platinum: "#7B68EE" };
const tierNext: Record<string, {visits: number, next: string}> = {
  bronze: {visits: 10, next: "Silver"}, silver: {visits: 25, next: "Gold"},
  gold: {visits: 50, next: "Platinum"}, platinum: {visits: 999, next: "Max"}
};

export default function WalletPage() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/wallet").then(r => r.json()).then(d => { setItems(Array.isArray(d) ? d : []); setLoading(false); });
  }, []);

  const totalPoints = items.reduce((s, i) => s + i.total_points, 0);
  const totalVisits = items.reduce((s, i) => s + i.total_visits, 0);

  return (
    <div className="page">
      <h1 className={styles.title}>{t("wallet_title")}</h1>

      <div className={styles.summaryCard}>
        <div className={styles.summaryItem}>
          <Zap size={20} color="var(--accent)" />
          <div><span className={styles.summaryValue}>{totalPoints}</span><span className={styles.summaryLabel}>{t("wallet_tot_points")}</span></div>
        </div>
        <div className={styles.divider} />
        <div className={styles.summaryItem}>
          <TrendingUp size={20} color="var(--success)" />
          <div><span className={styles.summaryValue}>{totalVisits}</span><span className={styles.summaryLabel}>{t("wallet_tot_visits")}</span></div>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>{t("wallet_loyalty_cards")}</h2>

      {loading ? (
        <div className={styles.empty}>{t("loading")}</div>
      ) : items.length === 0 ? (
        <div className={styles.empty}>
          <Award size={48} color="var(--text-secondary)" />
          <p>{t("wallet_no_cards")}</p><span>{t("wallet_no_cards_desc")}</span>
        </div>
      ) : (
        <div className={styles.list}>
          {items.map(item => {
            const tn = tierNext[item.tier] || tierNext.bronze;
            const progress = Math.min((item.total_visits / tn.visits) * 100, 100);
            return (
              <div key={item.id} className={styles.loyaltyItem}>
                <div className={styles.itemHeader}>
                  <div className={styles.merchantIcon}><span>{item.business_name[0]}</span></div>
                  <div className={styles.merchantInfo}><strong>{item.business_name}</strong><span className={styles.category}>{item.category}</span></div>
                  <span className={styles.tierBadge} style={{background: tierColors[item.tier] + "22", color: tierColors[item.tier]}}>{item.tier}</span>
                </div>
                <div className={styles.statsRow}>
                  <span>{item.total_visits} {t("mdetail_visits")}</span><span>{item.total_points} pts</span>
                  {item.discount_percent > 0 && <span className={styles.discount}>{item.discount_percent}% {t("mdetail_off").toLowerCase()}</span>}
                </div>
                <div className={styles.progressBar}><div className={styles.progressFill} style={{width: `${progress}%`, background: tierColors[item.tier]}} /></div>
                <span className={styles.progressLabel}>{item.total_visits}/{tn.visits} {t("wallet_to")} {tn.next}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}