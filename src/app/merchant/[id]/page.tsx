"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Star, MapPin, Percent, Phone, Clock, Send } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import styles from "./page.module.css";

export default function MerchantDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { t } = useLanguage();
  const [merchant, setMerchant] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ stars: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/merchants?id=${id}`).then(r => r.json()).then(d => setMerchant(Array.isArray(d) ? d[0] : d));
    fetch(`/api/reviews?merchantId=${id}`).then(r => r.json()).then(setReviews);
  }, [id]);

  async function submitReview() {
    setSubmitting(true);
    await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ merchantId: id, ...newReview }) });
    const updated = await fetch(`/api/reviews?merchantId=${id}`).then(r => r.json());
    setReviews(updated);
    setNewReview({ stars: 5, comment: "" });
    setSubmitting(false);
  }

  if (!merchant) return <div className={styles.loading}><div className={styles.spinner} /></div>;

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <button className={styles.backBtn} onClick={() => router.back()}><ArrowLeft size={20} /></button>
        <div className={styles.heroContent}>
          <div className={styles.logo}><span>{merchant.business_name[0]}</span></div>
          <h1>{merchant.business_name}</h1>
          <p className={styles.category}>{merchant.category}</p>
        </div>
      </div>

      <div className="page" style={{paddingTop:0}}>
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <Star size={18} fill="#F59E0B" color="#F59E0B" />
            <strong>{Number(merchant.rating).toFixed(1)}</strong>
            <span>({merchant.review_count} {t("mdetail_reviews")})</span>
          </div>
          {merchant.discount_percent > 0 && (
            <div className={`${styles.stat} ${styles.discountBadge}`}>
              <Percent size={16} />
              <strong>{merchant.discount_percent}% {t("mdetail_off")}</strong>
            </div>
          )}
        </div>

        <div className={`card ${styles.infoCard}`}>
          <div className={styles.infoRow}><MapPin size={16} color="var(--accent)" /><span>{merchant.address}</span></div>
          {merchant.phone && <div className={styles.infoRow}><Phone size={16} color="var(--accent)" /><span>{merchant.phone}</span></div>}
          {merchant.description && <p className={styles.desc}>{merchant.description}</p>}
        </div>

        <div className={styles.loyaltyCard}>
          <div className={styles.loyaltyHeader}>
            <h3>{t("mdetail_loyalty_title")}</h3>
            <span className="badge badge-accent">0 / 10 {t("mdetail_visits")}</span>
          </div>
          <div className={styles.progressBar}><div className={styles.progressFill} style={{width:"0%"}} /></div>
          <p className={styles.loyaltyHint}>{t("mdetail_loyalty_hint")}</p>
        </div>

        <h2 className={styles.sectionTitle}>{t("mdetail_reviews_title")}</h2>

        {session?.user?.role === "student" && (
          <div className={`card ${styles.reviewForm}`}>
            <div className={styles.starPicker}>
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setNewReview(p => ({...p, stars: s}))}>
                  <Star size={24} fill={s <= newReview.stars ? "#F59E0B" : "none"} color="#F59E0B" />
                </button>
              ))}
            </div>
            <textarea placeholder={t("mdetail_review_ph")} value={newReview.comment} onChange={e => setNewReview(p => ({...p, comment: e.target.value}))} rows={3} className={styles.textarea} />
            <button className="btn-primary" onClick={submitReview} disabled={submitting}><Send size={16} /> {t("mdetail_review_submit")}</button>
          </div>
        )}

        {reviews.length === 0 ? (
          <p className={styles.noReviews}>{t("mdetail_no_reviews")}</p>
        ) : (
          <div className={styles.reviewList}>
            {reviews.map(r => (
              <div key={r.id} className={`card ${styles.reviewItem}`}>
                <div className={styles.reviewHeader}>
                  <strong>{r.reviewer_name}</strong>
                  <div className={styles.reviewStars}>{Array.from({length: r.stars}).map((_, i) => <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />)}</div>
                </div>
                {r.comment && <p>{r.comment}</p>}
                <span className={styles.reviewDate}>{new Date(r.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}