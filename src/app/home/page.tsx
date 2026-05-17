"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Search, Star, MapPin, Percent, ChevronRight } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";

const categories = ["All", "Food", "Cafe", "Tech", "Books", "Fashion", "Health", "Services"];

export default function HomePage() {
  const { data: session } = useSession();
  const [merchants, setMerchants] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== "All") params.set("category", category);
    if (search) params.set("search", search);
    fetch(`/api/merchants?${params}`).then(r => r.json()).then(d => { setMerchants(d); setLoading(false); });
  }, [category, search]);

  return (
    <div className="page">
      <header className={styles.header}>
        <div>
          <p className={styles.greeting}>Hello, {session?.user?.name?.split(" ")[0]} 👋</p>
          <h1 className={styles.heading}>Discover Merchants</h1>
        </div>
        <div className={styles.avatar}>
          {session?.user?.image ? (
            <img src={session.user.image} alt="" width={44} height={44} style={{borderRadius:"50%"}} />
          ) : (
            <span>{session?.user?.name?.[0]}</span>
          )}
        </div>
      </header>

      <div className="search-bar" style={{marginBottom:16}}>
        <Search size={18} color="#9CA3AF" />
        <input placeholder="Search merchants..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className={styles.categories}>
        {categories.map(c => (
          <button key={c} className={`${styles.catBtn} ${category === c ? styles.catActive : ""}`} onClick={() => setCategory(c)}>
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className={styles.loadingGrid}>
          {[1,2,3].map(i => <div key={i} className={styles.skeleton} />)}
        </div>
      ) : merchants.length === 0 ? (
        <div className={styles.empty}>
          <p>No merchants found</p>
          <span>Try a different search or category</span>
        </div>
      ) : (
        <div className={styles.grid}>
          {merchants.map((m, i) => (
            <Link href={`/merchant/${m.id}`} key={m.id} className={`card ${styles.merchantCard}`} style={{animationDelay: `${i * 0.08}s`}}>
              <div className={styles.cardHeader}>
                <div className={styles.merchantLogo}>
                  {m.logo_url ? <img src={m.logo_url} alt="" /> : <span>{m.business_name[0]}</span>}
                </div>
                {m.discount_percent > 0 && (
                  <span className="badge badge-accent"><Percent size={12} /> {m.discount_percent}%</span>
                )}
              </div>
              <h3 className={styles.merchantName}>{m.business_name}</h3>
              <p className={styles.merchantCat}>{m.category}</p>
              <div className={styles.cardFooter}>
                <span className={styles.rating}><Star size={14} fill="#F59E0B" color="#F59E0B" /> {Number(m.rating).toFixed(1)}</span>
                <span className={styles.address}><MapPin size={12} /> {m.address?.substring(0, 20)}</span>
                <ChevronRight size={16} color="#9CA3AF" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}