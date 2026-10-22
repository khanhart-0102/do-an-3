import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import {
  ArrowRight,
  AudioLines,
  BookOpen,
  CheckCircle2,
  FileText,
  Headphones,
  HeartHandshake,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const learningTools = [
  {
    icon: BookOpen,
    tint: "bg-emerald-100 text-emerald-700",
    title: "Bài học theo lộ trình",
    detail: "Sắp xếp nội dung theo khóa học và từng bước luyện tập.",
  },
  {
    icon: Headphones,
    tint: "bg-sky-100 text-sky-700",
    title: "Thực hành bốn kỹ năng",
    detail: "Luyện Listening, Reading, Speaking và Writing ở cùng một nơi.",
  },
  {
    icon: AudioLines,
    tint: "bg-violet-100 text-violet-700",
    title: "Ôn tập chủ động",
    detail: "Ghi nhớ từ vựng, xem lại lịch sử và tiếp tục tiến độ của bạn.",
  },
  {
    icon: FileText,
    tint: "bg-orange-100 text-orange-700",
    title: "Bài tập và bài kiểm tra",
    detail: "Tải đề, luyện tập và nhận góp ý cho bài đã nộp.",
  },
];

export default function AboutPage() {
  return (
    <div className="w-full bg-white">
      <section className="overflow-hidden bg-[#f5f8f0]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[1fr_0.9fr] lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-800">
              <HeartHandshake className="h-4 w-4" />
              Học có mục tiêu · Tiến bộ từng bước
            </span>
            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
              Học tiếng Anh theo cách{" "}
              <span className="text-emerald-700">phù hợp với bạn.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Lingo tạo nên một không gian học tập trực tuyến để bạn khám phá
              bài học, thực hành kỹ năng và lưu lại hành trình của mình trong
              cùng một nơi.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <SignUpButton mode="modal">
                <Button size="lg" className="h-12 gap-2 rounded-xl bg-emerald-700 px-6 hover:bg-emerald-800">
                  Bắt đầu học <ArrowRight className="h-4 w-4" />
                </Button>
              </SignUpButton>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-xl bg-white">
                <Link href="/courses-public">Khám phá khóa học</Link>
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
              {["Học theo nhịp riêng", "Theo dõi tiến độ", "Ôn luyện chủ động"].map(
                (item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    {item}
                  </span>
                )
              )}
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[540px]">
            <Image
              src="/illustrations/learning-hero.svg"
              alt="Học viên đang học tiếng Anh trực tuyến"
              width={640}
              height={480}
              className="block h-auto w-full"
            />
            <div className="absolute bottom-3 right-0 rounded-2xl border border-white bg-white/95 p-4 shadow-lg sm:-right-3 sm:bottom-10">
              <p className="text-sm font-bold text-slate-900">
                Mỗi bước nhỏ đều đáng giá
              </p>
              <p className="mt-1 text-xs text-slate-500">Luyện tập theo mục tiêu</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-8 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm sm:p-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
              Triết lý học tập
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
              Bắt đầu nhỏ. Kiên trì mỗi ngày.
            </h2>
          </div>
          <p className="text-lg leading-8 text-slate-600">
            Chúng tôi tin rằng học tốt hơn bắt đầu từ những bước vừa sức: chọn
            mục tiêu phù hợp, dành thời gian thực hành và nhìn lại những gì mình
            đã hoàn thành. Lingo tập hợp các công cụ học và luyện tập để bạn dễ
            dàng duy trì hành trình đó.
          </p>
        </div>
      </section>

      <section className="bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
              Mọi thứ bạn cần để bắt đầu
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Một không gian học tập trọn vẹn
            </h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {learningTools.map(({ icon: Icon, tint, title, detail }) => (
              <article
                key={title}
                className="rounded-3xl border border-slate-200 bg-white p-6 transition-shadow hover:shadow-lg"
              >
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${tint}`}>
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:py-20">
        <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 rounded-[2rem] bg-emerald-950 px-7 py-10 text-white sm:flex-row sm:items-center sm:px-10">
          <div>
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-200">
              <Sparkles className="h-4 w-4" />
              Sẵn sàng bắt đầu?
            </span>
            <h2 className="mt-2 text-2xl font-black sm:text-3xl">
              Bước tiến đầu tiên bắt đầu từ hôm nay.
            </h2>
          </div>
          <SignUpButton mode="modal">
            <Button size="lg" className="shrink-0 gap-2 rounded-xl bg-white px-6 font-bold text-emerald-950 hover:bg-emerald-50">
              Tham gia Lingo <ArrowRight className="h-4 w-4" />
            </Button>
          </SignUpButton>
        </div>
      </section>
    </div>
  );
}
