"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { BarChart3, Users, Star, Percent, Save, Eye } from "lucide-react";
import styles from "./page.module.css";

export default function DashboardPage() {
  const { data: session } = useSession();
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
      <h1 className={styles.title}>Merchant Dashboard</h1>

      <div className={styles.statsGrid}>
        {[
          { icon: Star, label: "Rating", value: merchant ? Number(merchant.rating).toFixed(1) : "0.0", color: "var(--warning)" },
          { icon: Users, label: "Reviews", value: merchant?.review_count || 0, color: "var(--primary)" },
          { icon: Percent, label: "Discount", value: `${form.discount_percent}%`, color: "var(--accent)" },
          { icon: Eye, label: "Verified", value: merchant?.verified ? "Yes" : "No", color: "var(--success)" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className={styles.statCard}>
            <Icon size={20} color={color} />
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className={`card ${styles.formCard}`}>
        <h2 className={styles.sectionTitle}>Business Info</h2>
        <label className={styles.field}>
          <span>Business Name</span>
          <input value={form.business_name} onChange={e => setForm(f => ({...f, business_name: e.target.value}))} />
        </label>
        <label className={styles.field}>
          <span>Category</span>
          <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
            {["Food","Cafe","Tech","Books","Fashion","Health","Services","General"].map(c => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className={styles.field}>
          <span>Address</span>
          <input value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} />
        </label>
        <label className={styles.field}>
          <span>Phone</span>
          <input value={form.phone || ""} onChange={e => setForm(f => ({...f, phone: e.target.value}))} />
        </label>
        <label className={styles.field}>
          <span>Description</span>
          <textarea value={form.description || ""} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={3} />
        </label>
        <label className={styles.field}>
          <span>Discount (%)</span>
          <input type="number" min={0} max={100} value={form.discount_percent} onChange={e => setForm(f => ({...f, discount_percent: Number(e.target.value)}))} />
        </label>
        <button className="btn-primary" onClick={handleSave} disabled={saving}>
          <Save size={16} /> {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <h2 className={styles.sectionTitle} style={{marginTop:24}}>Recent Reviews</h2>
      {reviews.length === 0 ? (
        <p className={styles.noReviews}>No reviews yet</p>
      ) : reviews.slice(0, 5).map(r => (
        <div key={r.id} className={`card ${styles.reviewItem}`}>
          <div className={styles.reviewHeader}>
            <strong>{r.reviewer_name}</strong>
            <div className={styles.stars}>{Array.from({length: r.stars}).map((_, i) => <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />)}</div>
          </div>
          {r.comment && <p>{r.comment}</p>}
        </div>
      ))}
    </div>
  );
}