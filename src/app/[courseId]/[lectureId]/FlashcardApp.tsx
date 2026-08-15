"use client";

import { useState, useEffect, useMemo } from "react";
import { fsrs, createEmptyCard, Rating, Card } from "ts-fsrs";

interface RawCard {
  id: string;
  cat: string;
  f: string;
  b: string;
}

export default function FlashcardApp({ courseId, lectureId, cardsData }: { courseId: string, lectureId: string, cardsData: RawCard[] }) {
  const [fsrsStates, setFsrsStates] = useState<Record<string, Card>>({});
  const [activeCat, setActiveCat] = useState("همه");
  const [flipped, setFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFreeReview, setIsFreeReview] = useState(false);

  const storageKey = `fsrs_${courseId}_${lectureId}`;
  const f = useMemo(() => fsrs({}), []);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Date objects are strings in JSON, need to parse them
        for (const key in parsed) {
          parsed[key].due = new Date(parsed[key].due);
          parsed[key].last_review = parsed[key].last_review ? new Date(parsed[key].last_review) : undefined;
        }
        setFsrsStates(parsed);
      } catch (e) {}
    }
    setIsLoaded(true);
  }, [storageKey]);

  const cats = ["همه", ...Array.from(new Set(cardsData.map((c) => c.cat)))];

  // Filter cards by category and check if due
  const now = new Date();
  
  const activeCards = useMemo(() => {
    return cardsData.filter(c => {
      if (activeCat !== "همه" && c.cat !== activeCat) return false;
      if (isFreeReview) return true;
      const state = fsrsStates[c.id];
      if (!state) return true; // New card
      return state.due <= now;
    });
  }, [cardsData, fsrsStates, activeCat, now, isFreeReview]);

  const toFa = (n: number | string) => {
    const map: Record<string, string> = { '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴', '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹' };
    return String(n).split('').map(ch => map[ch] !== undefined ? map[ch] : ch).join('');
  };

  const handleGrade = (rating: Rating) => {
    if (activeCards.length === 0) return;
    const rawCard = activeCards[currentIndex];
    
    let cardState = fsrsStates[rawCard.id] || createEmptyCard();
    // if state due is string (fallback), parse it
    if (typeof cardState.due === 'string') cardState.due = new Date(cardState.due);
    if (typeof cardState.last_review === 'string') cardState.last_review = new Date(cardState.last_review);
    
    const scheduling_cards = f.repeat(cardState, new Date());
    const nextState = (scheduling_cards as any)[rating].card;

    const newStates = { ...fsrsStates, [rawCard.id]: nextState };
    setFsrsStates(newStates);
    localStorage.setItem(storageKey, JSON.stringify(newStates));
    
    setFlipped(false);
    
    // Move to next card, if we are at the end, wrap around
    // However, dueCards will re-evaluate! So the current card might disappear from dueCards.
    // That means if we keep currentIndex, it will point to the new card at this index, or we might need to reset to 0.
  };

  useEffect(() => {
    if (currentIndex >= activeCards.length) {
      setCurrentIndex(0);
    }
  }, [activeCards.length, currentIndex]);

  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % activeCards.length);
  };

  const handlePrev = () => {
    setFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + activeCards.length) % activeCards.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setFlipped(f => !f);
      } else if (e.code === 'ArrowLeft') {
        if (!flipped) handleNext();
      } else if (e.code === 'ArrowRight') {
        if (!flipped) handlePrev();
      } else if (flipped && !isFreeReview) {
        if (e.code === 'Digit1') handleGrade(Rating.Again);
        if (e.code === 'Digit2') handleGrade(Rating.Hard);
        if (e.code === 'Digit3') handleGrade(Rating.Good);
        if (e.code === 'Digit4') handleGrade(Rating.Easy);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [flipped, currentIndex, activeCards, fsrsStates, isFreeReview]);

  if (!isLoaded) return <div style={{ textAlign: "center", padding: "40px" }}>در حال بارگذاری...</div>;

  const currentRaw = activeCards[currentIndex];

  return (
    <>
      <div className="statbar">
        {isFreeReview ? (
          <div className="stat">مرور آزاد (همه کارت‌ها): <b style={{ color: "var(--pill-blue)" }}>{toFa(activeCards.length)}</b> کارت</div>
        ) : (
          <div className="stat">کارت‌های موعد مرور: <b style={{ color: "var(--pill-blue)" }}>{toFa(activeCards.length)}</b> از <b style={{ color: "var(--ink)" }}>{toFa(cardsData.length)}</b></div>
        )}
      </div>

      <div className="cats">
        {cats.map(c => (
          <button 
            key={c}
            className={`cat-btn ${activeCat === c ? 'active' : ''}`}
            onClick={() => { setActiveCat(c); setCurrentIndex(0); setFlipped(false); }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="stage">
        {currentRaw ? (
          <div className={`card ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
            <div className="face front">
              <span className="face-tag">{currentRaw.cat}</span>
              <span className="qnum">{toFa(currentIndex + 1)}/{toFa(activeCards.length)}</span>
              <div className="face-content">{currentRaw.f}</div>
            </div>
            <div className="face back">
              <span className="face-tag">پاسخ</span>
              <div className="face-content">{currentRaw.b}</div>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="face front" style={{ alignItems: "center" }}>
              <div className="face-content" style={{ color: "var(--pill-blue)" }}>
                آفرین! تمام فلش‌کارت‌های امروز را مرور کردید. 🎉
              </div>
            </div>
          </div>
        )}
      </div>

      {currentRaw && (
        <>
          <div className="hint">👆 برای دیدن پاسخ کلیک کنید یا کلید Space را بزنید</div>
          
          {flipped ? (
            isFreeReview ? (
              <div className="controls">
                <button className="ctrl-btn ghost" onClick={(e) => { e.stopPropagation(); handlePrev(); }}>◀ قبلی</button>
                <button className="ctrl-btn primary" onClick={(e) => { e.stopPropagation(); handleNext(); }}>بعدی ▶</button>
              </div>
            ) : (
              <div className="know-row" style={{ flexWrap: "wrap" }}>
                <button className="know-btn no" onClick={(e) => { e.stopPropagation(); handleGrade(Rating.Again); }} title="کلید 1">🔴 دوباره (1)</button>
                <button className="know-btn" style={{ background: "rgba(232,192,125,0.15)", color: "var(--gold)", borderColor: "rgba(232,192,125,0.4)" }} onClick={(e) => { e.stopPropagation(); handleGrade(Rating.Hard); }} title="کلید 2">🟠 سخت (2)</button>
                <button className="know-btn yes" onClick={(e) => { e.stopPropagation(); handleGrade(Rating.Good); }} title="کلید 3">🟢 خوب (3)</button>
                <button className="know-btn yes" style={{ borderColor: "var(--pill-blue)", background: "rgba(159,211,214,0.3)" }} onClick={(e) => { e.stopPropagation(); handleGrade(Rating.Easy); }} title="کلید 4">🔵 آسان (4)</button>
              </div>
            )
          ) : (
            <div className="controls">
              <button className="ctrl-btn ghost" onClick={handlePrev}>◀ قبلی</button>
              <button className="ctrl-btn primary" onClick={handleNext}>بعدی ▶</button>
            </div>
          )}
        </>
      )}

      <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "40px" }}>
        <button 
          className="cat-btn" 
          onClick={() => { setIsFreeReview(!isFreeReview); setCurrentIndex(0); setFlipped(false); }}
        >
          {isFreeReview ? "پایان مرور آزاد" : "مرور آزاد (همه کارت‌ها)"}
        </button>
        <button 
          className="cat-btn" 
          onClick={() => {
            if (confirm("آیا از حذف پیشرفت خود مطمئن هستید؟")) {
              setFsrsStates({});
              localStorage.removeItem(storageKey);
              setCurrentIndex(0);
              setFlipped(false);
              setIsFreeReview(false);
            }
          }}
        >
          حذف پیشرفت (شروع دوباره)
        </button>
      </div>
    </>
  );
}
