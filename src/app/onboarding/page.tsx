"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GraduationCap, Store, ArrowLeft } from "lucide-react";
import styles from "./page.module.css";

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showMerchantForm, setShowMerchantForm] = useState(false);
  
  const [formData, setFormData] = useState({
    business_name: "",
    category: "Food",
    address: "",
    discount_percent: 10
  });

  async function handleStudentSelect() {
    setLoading(true);
    await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "student" }),
    });
    await update({ role: "student" });
    router.push("/home");
  }

  async function handleMerchantSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        role: "merchant",
        ...formData
      }),
    });
    await update({ role: "merchant" });
    router.push("/dashboard");
  }

  if (showMerchantForm) {
    return (
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <button className={styles.backBtn} onClick={() => setShowMerchantForm(false)}>
            <ArrowLeft size={20} /> Back
          </button>
          <h2 className={styles.formTitle}>Register Business</h2>
          <form onSubmit={handleMerchantSubmit} className={styles.form}>
            <label className={styles.field}>
              <span>Business Name</span>
              <input required value={formData.business_name} onChange={e => setFormData(f => ({...f, business_name: e.target.value}))} placeholder="E.g., Campus Cafe" />
            </label>
            <label className={styles.field}>
              <span>Category</span>
              <select value={formData.category} onChange={e => setFormData(f => ({...f, category: e.target.value}))}>
                {["Food", "Cafe", "Stationery", "Clothing", "Pharmacy", "Other"].map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className={styles.field}>
              <span>Address</span>
              <textarea required value={formData.address} onChange={e => setFormData(f => ({...f, address: e.target.value}))} rows={2} placeholder="Full address" />
            </label>
            <label className={styles.field}>
              <span>Student Discount: {formData.discount_percent}%</span>
              <input type="range" min="5" max="50" step="1" value={formData.discount_percent} onChange={e => setFormData(f => ({...f, discount_percent: parseInt(e.target.value)}))} className={styles.slider} />
              <small>Attract more students with a higher discount!</small>
            </label>
            <button type="submit" className="btn-primary" disabled={loading} style={{marginTop: 10}}>
              {loading ? "Registering..." : "Register My Business"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome, {session?.user?.name?.split(" ")[0]}!</h1>
      <p className={styles.subtitle}>How will you use EsnafTim?</p>
      <div className={styles.cards}>
        <button className={styles.roleCard} onClick={handleStudentSelect} disabled={loading}>
          <GraduationCap size={40} />
          <h3>Student</h3>
          <p>Access exclusive discounts near you</p>
        </button>
        <button className={styles.roleCard} onClick={() => setShowMerchantForm(true)} disabled={loading}>
          <Store size={40} />
          <h3>Merchant</h3>
          <p>Grow your business, attract students</p>
        </button>
      </div>
    </div>
  );
}