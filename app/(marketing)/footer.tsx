import Link from "next/link";
import { ArrowUpRight, BookOpen, GraduationCap, Sparkles } from "lucide-react";

const footerLinks = [
  { href: "/courses-public", label: "Khám phá khóa học" },
  { href: "/student/pdf-assignments", label: "Bài tập PDF" },
  { href: "/admission-tests", label: "Kiểm tra đầu vào" },
  { href: "/about", label: "Về Lingo" },
  { href: "/contact", label: "Liên hệ hỗ trợ" },
];

export const Footer = () => (
  <footer className="border-t border-slate-800 bg-slate-950 text-white">
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.2fr_0.8fr] md:py-14">
      <div>
        <Link href="/" className="inline-flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-700">
            <BookOpen className="h-6 w-6 text-white" aria-hidden="true" />
          </span>
          <span className="text-2xl font-black tracking-tight">Lingo</span>
        </Link>
        <p className="mt-4 max-w-md leading-7 text-slate-400">
          Một không gian học tiếng Anh để luyện tập theo mục tiêu, ghi nhận
          những bước tiến và giữ cảm hứng học mỗi ngày.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            { icon: BookOpen, label: "Học có lộ trình" },
            { icon: GraduationCap, label: "Bốn kỹ năng" },
            { icon: Sparkles, label: "Tiến bộ mỗi ngày" },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300"
            >
              <Icon className="h-3.5 w-3.5 text-emerald-300" />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="md:justify-self-end md:pr-8">
        <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-300">
          Khám phá Lingo
        </h2>
        <nav className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-1">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group inline-flex items-center gap-2 py-1 text-sm text-slate-400 transition-colors hover:text-white"
            >
              {link.label}
              <ArrowUpRight className="h-3.5 w-3.5 text-emerald-300 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </nav>
      </div>
    </div>
    <div className="border-t border-white/10">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-4 text-xs text-slate-500 sm:px-8 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Lingo. Cùng bạn học tốt hơn mỗi ngày.</span>
        <span>Học theo nhịp riêng · Tiến bộ từng bước</span>
      </div>
    </div>
  </footer>
);
