import Link from "next/link";
import fs from "fs";
import path from "path";
import ExamDateSetter from "./ExamDateSetter";

export async function generateStaticParams() {
  const coursesPath = path.join(process.cwd(), "src/data/courses.json");
  const courses = JSON.parse(fs.readFileSync(coursesPath, "utf-8"));
  return courses.map((course: any) => ({
    courseId: course.id,
  }));
}

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  
  const coursesPath = path.join(process.cwd(), "src/data/courses.json");
  const courses = JSON.parse(fs.readFileSync(coursesPath, "utf-8"));
  const course = courses.find((c: any) => c.id === courseId);

  let lectures = [];
  try {
    const lecturesPath = path.join(process.cwd(), `src/data/courses/${courseId}/index.json`);
    lectures = JSON.parse(fs.readFileSync(lecturesPath, "utf-8"));
  } catch (e) {
    // ignore
  }

  return (
    <div className="wrap">
      <header>
        <div className="eyebrow">
          <Link href="/" style={{ color: "var(--gold)", textDecoration: "none" }}>همه دوره‌ها</Link>
          {" · "}
          {course?.title}
        </div>
        <h1>جلسات <em>{course?.title}</em></h1>
        <div className="subtitle">جلسه مورد نظر را برای مرور فلش‌کارت‌ها انتخاب کنید</div>
      </header>

      <ExamDateSetter courseId={courseId} />

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "24px" }}>
        {lectures.map((lecture: any) => (
          <Link href={`/${courseId}/${lecture.id}`} key={lecture.id} style={{ textDecoration: "none" }}>
            <div className="card" style={{ minHeight: "auto", cursor: "pointer", transition: "all 0.2s" }}>
              <div className="face front" style={{ position: "relative", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "600", margin: 0, color: "var(--ink)" }}>{lecture.title}</h3>
                <span style={{ color: "var(--pill-blue)", fontSize: "14px", fontWeight: "700" }}>شروع مرور ▶</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
