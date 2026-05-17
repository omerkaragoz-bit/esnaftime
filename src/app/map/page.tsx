"use client";
import { useEffect, useState } from "react";
import { MapPin, Star, Percent, Navigation } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";

export default function MapPage() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    fetch("/api/merchants").then(r => r.json()).then(d => setMerchants(Array.isArray(d) ? d : []));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.mapPlaceholder}>
        <div className={styles.mapBg}>
          <Navigation size={48} color="var(--primary)" style={{opacity:0.15}} />
          <p>Map View</p>
          <span>Merchant locations will appear here</span>
        </div>
        <div className={styles.pins}>
          {merchants.map((m, i) => (
            <button
              key={m.id}
              className={`${styles.pin} ${selected?.id === m.id ? styles.pinActive : ""}`}
              style={{ left: `${15 + (i * 17) % 70}%`, top: `${20 + (i * 23) % 55}%` }}
              onClick={() => setSelected(m)}
            >
              <MapPin size={24} fill={selected?.id === m.id ? "var(--accent)" : "var(--primary)"} color="#fff" />
            </button>
          ))}
        </div>
      </div>

      {selected && (
        <Link href={`/merchant/${selected.id}`} className={styles.popup}>
          <div className={styles.popupIcon}><span>{selected.business_name[0]}</span></div>
          <div className={styles.popupInfo}>
            <strong>{selected.business_name}</strong>
            <span>{selected.category}</span>
            <div className={styles.popupMeta}>
              <span><Star size={12} fill="#F59E0B" color="#F59E0B" /> {Number(selected.rating).toFixed(1)}</span>
              {selected.discount_percent > 0 && <span><Percent size={12} /> {selected.discount_percent}%</span>}
            </div>
          </div>
        </Link>
      )}

      <div className={styles.list}>
        <h3 className={styles.listTitle}>Nearby Merchants ({merchants.length})</h3>
        {merchants.map(m => (
          <Link key={m.id} href={`/merchant/${m.id}`} className={styles.listItem}>
            <div className={styles.listIcon}><span>{m.business_name[0]}</span></div>
            <div className={styles.listInfo}>
              <strong>{m.business_name}</strong>
              <span>{m.address?.substring(0, 30)}</span>
            </div>
            <span className={styles.listRating}><Star size={12} fill="#F59E0B" color="#F59E0B" /> {Number(m.rating).toFixed(1)}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}