"use client";

import { Button } from "@/components/ui/button";
import {
  BookOpen,
  BookOpenCheck,
  ChevronDown,
  GraduationCap,
  Loader,
  Menu,
  X,
} from "lucide-react";
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

const navigation = [
  { href: "/courses-public", label: "Khóa học" },
  { href: "/student/pdf-assignments", label: "Bài tập PDF" },
  { href: "/admission-tests", label: "Kiểm tra đầu vào" },
  { href: "/about", label: "Về Lingo" },
  { href: "/contact", label: "Liên hệ" },
];

export const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 shadow-sm shadow-slate-900/[0.025] backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-5 sm:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-700 shadow-md shadow-emerald-900/15 transition-transform group-hover:-rotate-6">
            <BookOpenCheck className="h-6 w-6 text-white" aria-hidden="true" />
          </span>
          <span className="text-2xl font-black tracking-tight text-emerald-800">
            Lingo
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <Link
            href="/"
            className="rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800"
          >
            Trang chủ
          </Link>
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 sm:flex">
          <ClerkLoading>
            <Loader className="h-5 w-5 animate-spin text-emerald-700" />
          </ClerkLoading>
          <ClerkLoaded>
            <SignedIn>
              <Button asChild variant="ghost" size="sm" className="rounded-xl font-semibold">
                <Link href="/student">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Khu học tập
                </Link>
              </Button>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" className="rounded-xl font-semibold">
                  Đăng nhập
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="rounded-xl bg-emerald-700 px-4 font-semibold hover:bg-emerald-800">
                  Bắt đầu miễn phí
                </Button>
              </SignUpButton>
            </SignedOut>
          </ClerkLoaded>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-marketing-nav"
          onClick={() => setMenuOpen((open) => !open)}
          className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-700 transition-colors hover:bg-emerald-50 sm:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-marketing-nav"
          className="border-t border-slate-100 bg-white px-5 pb-5 pt-3 sm:hidden"
        >
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-800 hover:bg-emerald-50"
            >
              <BookOpen className="h-4 w-4 text-emerald-700" />
              Trang chủ
            </Link>
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-800 hover:bg-emerald-50"
              >
                <ChevronDown className="h-4 w-4 -rotate-90 text-emerald-700" />
                {item.label}
              </Link>
            ))}
          </div>
          <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
            <ClerkLoaded>
              <SignedIn>
                <Button asChild className="w-full rounded-xl bg-emerald-700">
                  <Link href="/student" onClick={() => setMenuOpen(false)}>
                    Khu học tập
                  </Link>
                </Button>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" className="flex-1 rounded-xl">
                    Đăng nhập
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="flex-1 rounded-xl bg-emerald-700 hover:bg-emerald-800">
                    Đăng ký
                  </Button>
                </SignUpButton>
              </SignedOut>
            </ClerkLoaded>
          </div>
        </nav>
      )}
    </header>
  );
};
