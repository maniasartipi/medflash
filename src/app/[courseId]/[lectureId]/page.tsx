import fs from "fs";
import path from "path";
import FlashcardApp from "./FlashcardApp";
import Link from "next/link";

export async function generateStaticParams() {
  const coursesStr = fs.readFileSync(path.join(process.cwd(), "src/data/courses.json"), "utf-8");
  const courses = JSON.parse(coursesStr);
  let allParams: { courseId: string, lectureId: string }[] = [];
  
  for (const course of courses) {
    try {
      const indexStr = fs.readFileSync(path.join(process.cwd(), `src/data/courses/${course.id}/index.json`), "utf-8");
      const lectures = JSON.parse(indexStr);
      for (const lecture of lectures) {
        allParams.push({
          courseId: course.id,
          lectureId: lecture.id,
        });
      }
    } catch(e) {}
  }
  return allParams;
}

export default async function LecturePage({ params }: { params: Promise<{ courseId: string, lectureId: string }> }) {
  const { courseId, lectureId } = await params;

  let cards = [];
  try {
    const cardsPath = path.join(process.cwd(), `src/data/courses/${courseId}/${lectureId}.json`);
    cards = JSON.parse(fs.readFileSync(cardsPath, "utf-8"));
  } catch (e) {
    // missing cards
  }

  let lectureTitle = "فلش‌کارت‌ها";
  let lectureCreators = "";
  let lectureEditor = "";
  try {
    const indexStr = fs.readFileSync(path.join(process.cwd(), `src/data/courses/${courseId}/index.json`), "utf-8");
    const lectures = JSON.parse(indexStr);
    const lecture = lectures.find((l: any) => l.id === lectureId);
    if (lecture) {
      lectureTitle = lecture.title;
      if (lecture.creators) lectureCreators = lecture.creators;
      if (lecture.editor) lectureEditor = lecture.editor;
    }
  } catch (e) {}

  return (
    <div className="wrap">
      <header>
        <div className="eyebrow">
          <Link href={`/${courseId}`} style={{ color: "var(--gold)", textDecoration: "none" }}>بازگشت به جلسات</Link>
          {" · "}
          {lectureTitle}
        </div>
        <h1>مرور <em>{lectureTitle}</em> با فلش‌کارت</h1>
        <div className="subtitle">بر روی کارت کلیک کنید تا پاسخ را ببینید</div>
      </header>

      <FlashcardApp courseId={courseId} lectureId={lectureId} cardsData={cards} />

      <footer>
        {lectureCreators && <span>گردآورندگان: {lectureCreators}</span>}
        {lectureCreators && lectureEditor && <span> — </span>}
        {lectureEditor && <span>ادیتور: {lectureEditor}</span>}
        {!lectureCreators && !lectureEditor && <span>مدیریت فلش‌کارت‌ها</span>}
      </footer>
    </div>
  );
}
