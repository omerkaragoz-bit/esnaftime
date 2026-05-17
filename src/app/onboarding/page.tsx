"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GraduationCap, Store, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import styles from "./page.module.css";

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [showMerchantForm, setShowMerchantForm] = useState(false);
  
  const [formData, setFormData] = useState({
    business_name: "", category: "Food", address: "", discount_percent: 10
  });

  async function handleStudentSelect() {
    setLoading(true);
    await fetch("/api/user", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role: "student" }) });
    await update({ role: "student" });
    router.push("/home");
  }

  async function handleMerchantSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/user", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role: "merchant", ...formData }) });
    await update({ role: "merchant" });
    router.push("/dashboard");
  }

  if (showMerchantForm) {
    return (
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <button className={styles.backBtn} onClick={() => setShowMerchantForm(false)}><ArrowLeft size={20} /> {t("onboarding_back")}</button>
          <h2 className={styles.formTitle}>{t("onboarding_form_title")}</h2>
          <form onSubmit={handleMerchantSubmit} className={styles.form}>
            <label className={styles.field}>
              <span>{t("onboarding_bname")}</span>
              <input required value={formData.business_name} onChange={e => setFormData(f => ({...f, business_name: e.target.value}))} placeholder={t("onboarding_bname_ph")} />
            </label>
            <label className={styles.field}>
              <span>{t("onboarding_category")}</span>
              <select value={formData.category} onChange={e => setFormData(f => ({...f, category: e.target.value}))}>
                {["Food", "Cafe", "Stationery", "Clothing", "Pharmacy", "Other"].map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className={styles.field}>
              <span>{t("onboarding_address")}</span>
              <textarea required value={formData.address} onChange={e => setFormData(f => ({...f, address: e.target.value}))} rows={2} placeholder={t("onboarding_address_ph")} />
            </label>
            <label className={styles.field}>
              <span>{t("onboarding_discount")} {formData.discount_percent}%</span>
              <input type="range" min="5" max="50" step="1" value={formData.discount_percent} onChange={e => setFormData(f => ({...f, discount_percent: parseInt(e.target.value)}))} className={styles.slider} />
              <small>{t("onboarding_discount_desc")}</small>
            </label>
            <button type="submit" className="btn-primary" disabled={loading} style={{marginTop: 10, background: "var(--accent)"}}>
              {loading ? t("onboarding_registering") : t("onboarding_register_btn")}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{t("onboarding_welcome")} {session?.user?.name?.split(" ")[0]}!</h1>
      <p className={styles.subtitle}>{t("onboarding_subtitle")}</p>
      <div className={styles.cards}>
        <div className={styles.roleCard}>
          <GraduationCap size={40} color="#3B82F6" />
          <h3>{t("onboarding_student")}</h3>
          <p>{t("onboarding_student_desc")}</p>
          <button className={styles.studentBtn} onClick={handleStudentSelect} disabled={loading}>{t("onboarding_student_btn")}</button>
        </div>
        <div className={styles.roleCard}>
          <Store size={40} color="var(--accent)" />
          <h3>{t("onboarding_merchant")}</h3>
          <p>{t("onboarding_merchant_desc")}</p>
          <button className={styles.merchantBtn} onClick={() => setShowMerchantForm(true)} disabled={loading}>{t("onboarding_merchant_btn")}</button>
        </div>
      </div>
    </div>
  );
}