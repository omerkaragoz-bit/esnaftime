"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { BarChart3, Users, Star, Percent, Save, Eye } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import styles from "./page.module.css";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [merchant, setMerchant] = useState<any>(null);
  const [form, setForm] = useState({ business_name: "", category: "", address: "", phone: "", description: "", discount_percent: 0 });
  const [reviews, setReviews] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/merchants").then(r => r.json()).then(data => {
      const mine = Array.isArray(data) ? data.find((m: any) => m.user_id === session?.user?.id) : null;
      if (mine) { setMerchant(mine); setForm(mine); fetch(`/api/reviews?merchantId=${mine.id}`).then(r => r.json()).then(setReviews); }
    });
  }, [session]);

  async function handleSave() {
    setSaving(true);
    await fetch("/api/merchants", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="page">
      <h1 className={styles.title}>{t("dash_title")}</h1>

      <div className={styles.statsGrid}>
        {[
          { icon: Star, label: t("dash_rating"), value: merchant ? Number(merchant.rating).toFixed(1) : "0.0", color: "var(--warning)" },
          { icon: Users, label: t("dash_reviews"), value: merchant?.review_count || 0, color: "var(--primary)" },
          { icon: Percent, label: t("dash_discount"), value: `${form.discount_percent}%`, color: "var(--accent)" },
          { icon: Eye, label: t("dash_verified"), value: merchant?.verified ? "Yes" : "No", color: "var(--success)" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className={styles.statCard}>
            <Icon size={20} color={color} /><strong>{value}</strong><span>{label}</span>
          </div>
        ))}
      </div>

      <div className={`card ${styles.formCard}`}>
        <h2 className={styles.sectionTitle}>{t("dash_business_info")}</h2>
        <label className={styles.field}><span>{t("dash_bname")}</span><input value={form.business_name} onChange={e => setForm(f => ({...f, business_name: e.target.value}))} /></label>
        <label className={styles.field}>
          <span>{t("dash_category")}</span>
          <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
            {["Food","Cafe","Stationery","Clothing","Pharmacy","Other"].map(c => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className={styles.field}><span>{t("dash_address")}</span><input value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} /></label>
        <label className={styles.field}><span>{t("dash_phone")}</span><input value={form.phone || ""} onChange={e => setForm(f => ({...f, phone: e.target.value}))} /></label>
        <label className={styles.field}><span>{t("dash_desc")}</span><textarea value={form.description || ""} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} /></label>
        <label className={styles.field}><span>{t("dash_discount_pct")}</span><input type="number" min={0} max={100} value={form.discount_percent} onChange={e => setForm(f => ({...f, discount_percent: Number(e.target.value)}))} /></label>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          <Save size={16} /> {saved ? t("dash_saved") : saving ? t("dash_saving") : t("dash_save")}
        </button>
      </div>

      <h2 className={styles.sectionTitle} style={{marginTop:24}}>{t("dash_recent_reviews")}</h2>
      {reviews.length === 0 ? (
        <p className={styles.noReviews}>{t("dash_no_reviews")}</p>
      ) : reviews.slice(0, 5).map(r => (
        <div key={r.id} className={`card ${styles.reviewItem}`}>
          <div className={styles.reviewHeader}>
            <strong>{r.reviewer_name}</strong><div className={styles.stars}>{Array.from({length: r.stars}).map((_, i) => <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />)}</div>
          </div>
          {r.comment && <p>{r.comment}</p>}
        </div>
      ))}
    </div>
  );
}