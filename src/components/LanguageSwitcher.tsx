"use client";
import { useLanguage } from "@/lib/LanguageContext";

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  return (
    <div style={{ position: "absolute", top: "16px", right: "16px", zIndex: 100 }}>
      <div style={{ display: "flex", background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "4px", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.3)" }}>
        <button
          onClick={() => setLang("en")}
          style={{
            padding: "4px 12px", borderRadius: "16px", border: "none",
            background: lang === "en" ? "#fff" : "transparent",
            color: lang === "en" ? "var(--primary)" : "#fff",
            fontWeight: "600", fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s"
          }}
        >
          EN
        </button>
        <button
          onClick={() => setLang("tr")}
          style={{
            padding: "4px 12px", borderRadius: "16px", border: "none",
            background: lang === "tr" ? "#fff" : "transparent",
            color: lang === "tr" ? "var(--primary)" : "#fff",
            fontWeight: "600", fontSize: "0.8rem", cursor: "pointer", transition: "all 0.2s"
          }}
        >
          TR
        </button>
      </div>
    </div>
  );
}