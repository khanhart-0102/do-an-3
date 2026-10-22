import { AdmissionTestsList } from "@/components/marketing/admission-tests-list";
import {
  ArrowRight,
  BookOpenCheck,
  Clock3,
  Sparkles,
  Target,
} from "lucide-react";
import Image from "next/image";

const benefits = [
  {
    icon: Target,
    title: "Đánh giá đúng mục tiêu",
    detail: "Chọn bài kiểm tra phù hợp với kỹ năng bạn muốn luyện.",
    theme: "bg-sky-100 text-sky-700",
  },
  {
    icon: Clock3,
    title: "Làm bài theo thời gian",
    detail: "Luyện tập cách phân bổ thời gian cho từng phần.",
    theme: "bg-amber-100 text-amber-700",
  },
  {
    icon: BookOpenCheck,
    title: "Biết bước tiếp theo",
    detail: "Dùng kết quả để xác định nội dung cần tập trung hơn.",
    theme: "bg-emerald-100 text-emerald-700",
  },
];

export default function AdmissionTestsPage() {
  return (
    <div className="w-full bg-white">
      <section className="overflow-hidden bg-[#f2f7f3]">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-800">
              <Sparkles className="h-4 w-4" />
              Bắt đầu bằng việc hiểu trình độ của bạn
            </span>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
              Sẵn sàng cho{" "}
              <span className="text-emerald-700">bước tiếp theo?</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Chọn một bài kiểm tra, làm bài theo hướng dẫn và xem lại kết quả
              để biết mình nên tập trung cải thiện kỹ năng nào.
            </p>
            <a
              href="#tests"
              className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-700 px-6 font-semibold text-white shadow-lg shadow-emerald-900/15 transition-colors hover:bg-emerald-800"
            >
              Xem bài kiểm tra <ArrowRight className="h-4 w-4" />
            </a>
            <p className="mt-4 text-sm text-slate-500">
              Học theo mục tiêu của bạn — từng bước một.
            </p>
          </div>
          <div className="mx-auto w-full max-w-[560px]">
            <Image
              src="/illustrations/course-test.svg"
              alt="Minh họa hoàn thành bài kiểm tra và xem kết quả"
              width={640}
              height={480}
              className="block h-auto w-full"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {benefits.map(({ icon: Icon, title, detail, theme }) => (
            <article
              key={title}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${theme}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-bold text-slate-900">{title}</h2>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="tests" className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
                Luyện tập theo mục tiêu
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">
                Chọn bài kiểm tra phù hợp
              </h2>
            </div>
            <p className="max-w-lg text-sm leading-6 text-slate-600">
              Sau khi hoàn thành, hãy xem kết quả và dùng chúng để lên kế hoạch
              luyện tập tiếp theo.
            </p>
          </div>
          <AdmissionTestsList />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-16">
        <div className="grid gap-5 sm:grid-cols-3">
          {[
            ["1", "Chọn bài", "Tìm đề phù hợp với kỹ năng cần luyện."],
            ["2", "Tập trung làm bài", "Hoàn thành từng phần và theo dõi thời gian."],
            ["3", "Xem lại kết quả", "Ghi nhận điểm mạnh và phần nên cải thiện."],
          ].map(([number, title, detail]) => (
            <div key={number} className="flex gap-4 rounded-2xl bg-white p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-100 text-sm font-extrabold text-emerald-800">
                {number}
              </span>
              <div>
                <h3 className="font-bold text-slate-900">{title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-slate-600">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
