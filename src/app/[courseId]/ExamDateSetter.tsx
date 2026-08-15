"use client";

import { useState, useEffect } from "react";

export default function ExamDateSetter({ courseId }: { courseId: string }) {
  const [examDate, setExamDate] = useState<string>("");

  useEffect(() => {
    const savedDate = localStorage.getItem(`examDate_${courseId}`);
    if (savedDate) {
      setExamDate(savedDate);
    }
  }, [courseId]);

  const handleSave = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setExamDate(val);
    if (val) {
      localStorage.setItem(`examDate_${courseId}`, val);
    } else {
      localStorage.removeItem(`examDate_${courseId}`);
    }
  };

  const getDaysLeft = () => {
    if (!examDate) return null;
    const now = new Date();
    const target = new Date(examDate);
    const diff = target.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  };

  const daysLeft = getDaysLeft();

  return (
    <div style={{
      background: "var(--panel)",
      border: "1px solid var(--line)",
      padding: "16px",
      borderRadius: "16px",
      marginTop: "16px"
    }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px", justifyContent: "space-between" }}>
        <div>
          <label style={{ fontSize: "14px", fontWeight: "600", display: "block", marginBottom: "6px" }}>تاریخ آزمون (هدف):</label>
          <input 
            type="date" 
            value={examDate} 
            onChange={handleSave} 
            style={{
              background: "var(--bg-deep)",
              border: "1px solid var(--line)",
              color: "var(--ink)",
              padding: "8px 12px",
              borderRadius: "8px",
              fontFamily: "inherit",
              outline: "none"
            }}
          />
        </div>
        {daysLeft !== null && (
          <div style={{ textAlign: "left", fontSize: "14px" }}>
            {daysLeft > 0 ? (
              <span style={{ color: "var(--pill-blue)" }}>{daysLeft} روز تا آزمون باقی مانده</span>
            ) : daysLeft === 0 ? (
              <span style={{ color: "var(--gold)" }}>آزمون امروز است!</span>
            ) : (
              <span style={{ color: "var(--danger)" }}>آزمون گذشته است</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
