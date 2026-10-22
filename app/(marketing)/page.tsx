import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  AudioLines,
  BookOpen,
  Check,
  CheckCircle2,
  Clock3,
  FileText,
  GraduationCap,
  Headphones,
  MessageCircle,
  Play,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    icon: BookOpen,
    color: "bg-emerald-100 text-emerald-700",
    title: "Bài học bài bản",
    description:
      "Học từ vựng, ngữ pháp và luyện tập theo lộ trình được sắp xếp rõ ràng.",
  },
  {
    icon: Target,
    color: "bg-sky-100 text-sky-700",
    title: "Biết mình đang ở đâu",
    description:
      "Làm bài kiểm tra, xem lại lịch sử và theo dõi tiến độ học của bạn.",
  },
  {
    icon: MessageCircle,
    color: "bg-violet-100 text-violet-700",
    title: "Thực hành mỗi ngày",
    description:
      "Luyện từng kỹ năng với bài tập, flashcard và công cụ hỏi đáp.",
  },
];

const skills = [
  { icon: Headphones, label: "Listening", color: "text-cyan-700", bg: "bg-cyan-50", illustration: "/illustrations/course-listening.svg" },
  { icon: BookOpen, label: "Reading", color: "text-emerald-700", bg: "bg-emerald-50", illustration: "/illustrations/course-reading.svg" },
  { icon: AudioLines, label: "Speaking", color: "text-violet-700", bg: "bg-violet-50", illustration: "/illustrations/course-speaking.svg" },
  { icon: FileText, label: "Writing", color: "text-orange-700", bg: "bg-orange-50", illustration: "/illustrations/course-writing.svg" },
];

const steps = [
  {
    number: "01",
    title: "Chọn mục tiêu của bạn",
    detail: "Bắt đầu từ khóa học hoặc kỹ năng bạn muốn cải thiện.",
  },
  {
    number: "02",
    title: "Luyện tập từng bước",
    detail: "Học bài, làm bài tập và ghi nhớ từ mới theo nhịp riêng.",
  },
  {
    number: "03",
    title: "Nhìn lại tiến bộ",
    detail: "Theo dõi bài đã làm và tiếp tục mục tiêu tiếp theo.",
  },
];

export default function Home() {
  return (
    <div className="w-full overflow-hidden bg-white">
      <section className="relative isolate overflow-hidden bg-[#f6f8f0]">
        <div className="pointer-events-none absolute -left-36 top-12 h-80 w-80 rounded-full bg-emerald-100/70 blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 rounded-full bg-amber-100/70 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-12 sm:px-8 lg:min-h-[620px] lg:grid-cols-[1.02fr_0.98fr] lg:gap-4 lg:pb-20 lg:pt-14">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-sm">
              <Sparkles className="h-4 w-4" />
              Bắt đầu hành trình tiếng Anh của bạn
            </div>
            <h1 className="mt-7 text-4xl font-black leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-[4rem]">
              Tiếng Anh tốt hơn,
              <span className="mt-1 block text-emerald-700">từng ngày một.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl">
              Học, luyện tập và theo dõi tiến độ trong cùng một nơi. Bạn chọn
              mục tiêu — Lingo giúp bạn duy trì nhịp học mỗi ngày.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ClerkLoading>
                <Button size="lg" disabled className="h-12 gap-2 rounded-xl px-6 text-base">
                  Đang tải <Clock3 className="h-4 w-4 animate-pulse" />
                </Button>
              </ClerkLoading>
              <ClerkLoaded>
                <SignedOut>
                  <SignUpButton mode="modal">
                    <Button size="lg" className="h-12 gap-2 rounded-xl bg-emerald-700 px-6 text-base shadow-lg shadow-emerald-900/15 hover:bg-emerald-800">
                      Học thử miễn phí <ArrowRight className="h-4 w-4" />
                    </Button>
                  </SignUpButton>
                  <SignInButton mode="modal">
                    <Button size="lg" variant="outline" className="h-12 rounded-xl border-slate-300 bg-white/80 px-6 text-base">
                      Đăng nhập
                    </Button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <Button asChild size="lg" className="h-12 gap-2 rounded-xl bg-emerald-700 px-6 text-base shadow-lg shadow-emerald-900/15 hover:bg-emerald-800">
                    <Link href="/student">
                      Tiếp tục học <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </SignedIn>
              </ClerkLoaded>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
              {["Học theo nhịp riêng", "Luyện 4 kỹ năng", "Theo dõi tiến độ"].map(
                (item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                    {item}
                  </span>
                )
              )}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none">
            <div className="absolute -right-3 top-1/4 z-10 hidden rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl shadow-slate-900/10 sm:block lg:-right-5">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Zap className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Nhịp học của bạn</p>
                  <p className="font-bold text-slate-900">Bắt đầu thật tốt!</p>
                </div>
              </div>
            </div>
            <div className="absolute -left-2 bottom-10 z-10 hidden rounded-2xl border border-white/80 bg-white/95 px-4 py-3 shadow-xl shadow-slate-900/10 sm:block">
              <p className="text-xs text-slate-500">Hôm nay</p>
              <p className="mt-1 flex items-center gap-2 font-bold text-slate-900">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-amber-100 text-amber-700">
                  <Check className="h-4 w-4" />
                </span>
                Một bước gần mục tiêu hơn
              </p>
            </div>
            <div className="rounded-[2rem] border border-white/80 bg-white/65 p-3 shadow-2xl shadow-emerald-950/10 backdrop-blur sm:p-5">
              <Image
                src="/illustrations/learning-hero.svg"
                alt="Học viên thư giãn luyện tiếng Anh với laptop và sách"
                width={720}
                height={540}
                className="block h-auto w-full rounded-[1.5rem]"
                priority
              />
            </div>
          </div>
        </div>
        <div className="relative border-t border-emerald-900/5 bg-white/70">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-5 py-5 text-center sm:grid-cols-4 sm:px-8">
            {[
              ["4 kỹ năng", "Listening · Reading · Speaking · Writing"],
              ["Bài tập PDF", "Tải đề và nộp bài trực tuyến"],
              ["Flashcard", "Ôn từ vựng theo từng chủ đề"],
              ["Có lịch sử", "Xem lại quá trình luyện tập"],
            ].map(([title, detail]) => (
              <div key={title} className="px-2 py-1">
                <p className="font-bold text-slate-900">{title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
            Một nơi — nhiều cách học
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Học sao cho hợp với bạn
          </h2>
          <p className="mt-4 text-lg leading-7 text-slate-600">
            Không cần vội vàng. Bắt đầu từ một kỹ năng nhỏ, luyện tập đều và
            quay lại bất cứ khi nào bạn sẵn sàng.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {features.map(({ icon: Icon, color, title, description }) => (
            <article
              key={title}
              className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-950/5"
            >
              <div className={`grid h-12 w-12 place-items-center rounded-2xl ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">{title}</h3>
              <p className="mt-3 leading-7 text-slate-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#f8faf8] py-20 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
              Bốn kỹ năng, một hành trình
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Tự tin hơn qua từng lần luyện tập
            </h2>
            <p className="mt-5 leading-7 text-slate-600">
              Khám phá bài học và hoạt động phù hợp cho từng kỹ năng. Từng
              bước nhỏ sẽ giúp bạn hình thành thói quen học tập bền vững.
            </p>
            <Button asChild variant="outline" className="mt-7 h-11 gap-2 rounded-xl border-emerald-200 bg-white text-emerald-800 hover:bg-emerald-50">
              <Link href="/courses-public">
                Khám phá khóa học <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {skills.map(({ icon: Icon, label, color, bg, illustration }) => (
              <Link
                key={label}
                href="/courses-public"
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <Image
                  src={illustration}
                  alt={`Minh họa luyện ${label}`}
                  width={620}
                  height={400}
                  className="aspect-[1.55] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="flex items-center gap-3 p-4 sm:p-5">
                  <span className={`grid h-10 w-10 place-items-center rounded-xl ${bg} ${color}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900">{label}</h3>
                    <p className="text-sm text-slate-500">Luyện tập theo lộ trình</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:py-24">
        <div className="order-2 lg:order-1">
          <div className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-gradient-to-br from-[#e8f7f0] via-white to-[#fff5e8] p-5 sm:p-8">
            <div className="absolute right-5 top-5 rounded-full border border-white bg-white/90 px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm">
              Bài luyện tập
            </div>
            <Image
              src="/illustrations/practice-preview.svg"
              alt="Minh họa học viên thực hành một bài tập tiếng Anh trên máy tính"
              width={640}
              height={480}
              className="relative mx-auto block h-auto w-full max-w-lg"
            />
            <div className="mx-auto mt-2 max-w-md rounded-2xl border border-white bg-white/90 p-4 shadow-lg shadow-slate-900/5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">Luyện tập hôm nay</p>
                  <p className="mt-1 font-bold text-slate-900">Một câu trả lời mới</p>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                  <Play className="ml-0.5 h-4 w-4 fill-current" />
                </span>
              </div>
              <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="w-[68%] rounded-full bg-emerald-500" />
              </div>
              <p className="mt-2 text-xs text-slate-500">Cứ tiếp tục theo nhịp của bạn</p>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-700">
            Từng bước rõ ràng
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
            Tạo nhịp học bền vững theo cách của bạn
          </h2>
          <div className="mt-8 space-y-6">
            {steps.map((step) => (
              <div key={step.number} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-sm font-extrabold text-emerald-800">
                  {step.number}
                </span>
                <div className="pt-0.5">
                  <h3 className="font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-1.5 leading-6 text-slate-600">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 sm:px-8 lg:pb-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-emerald-950 px-7 py-12 text-white sm:px-12 sm:py-16">
          <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full border-[40px] border-white/5" />
          <div className="absolute -bottom-36 right-1/4 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-sm text-emerald-100">
                <GraduationCap className="h-4 w-4" />
                Bước đầu tiên không cần hoàn hảo
              </span>
              <h2 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
                Sẵn sàng mở đầu hành trình tiếng Anh của bạn?
              </h2>
              <p className="mt-4 leading-7 text-emerald-100/80">
                Chọn một bài học, thử một bài tập và bắt đầu tiến bộ từ hôm nay.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button size="lg" className="h-12 gap-2 rounded-xl bg-white px-6 font-bold text-emerald-950 hover:bg-emerald-50">
                    Bắt đầu học <ArrowRight className="h-4 w-4" />
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Button asChild size="lg" className="h-12 gap-2 rounded-xl bg-white px-6 font-bold text-emerald-950 hover:bg-emerald-50">
                  <Link href="/student">
                    Vào khu học tập <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </SignedIn>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-xl border-white/30 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white">
                <Link href="/admission-tests">Xem bài kiểm tra</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
