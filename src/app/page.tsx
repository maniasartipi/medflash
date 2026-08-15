import Link from "next/link";
import courses from "../data/courses.json";

export default function Home() {
  return (
    <div className="wrap">
      <header>
        <div className="eyebrow">Medical Flashcards</div>
        <h1>مرور <em>دوره‌ها</em></h1>
        <div className="subtitle">دوره‌ای که قصد مرور آن را دارید انتخاب کنید</div>
      </header>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "24px" }}>
        {courses.map((course) => (
          <Link href={`/${course.id}`} key={course.id} style={{ textDecoration: "none" }}>
            <div className="card" style={{ minHeight: "auto", cursor: "pointer", transition: "all 0.2s" }}>
              <div className="face front" style={{ position: "relative", padding: "24px" }}>
                <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px", color: "var(--ink)" }}>{course.title}</h2>
                <p style={{ color: "var(--ink-dim)", fontSize: "14px", margin: "0 0 12px 0" }}>{course.description}</p>
                <div style={{ fontSize: "12px", color: "var(--gold)" }}>استاد: {course.teacher}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <footer style={{ marginTop: "32px", textAlign: "center", fontSize: "12px", color: "var(--ink-dim)" }}>
        <a href="https://pngtree.com/freepng/initials-m-logo-vector--letter-m-logo_5284792.html" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "underline" }}>
          Icon png image from pngtree.com
        </a>
      </footer>
    </div>
  );
}
