/**
 * Contact Page
 */

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `[Lingo] ${formData.subject.trim()}`;
    const body = [
      `Họ và tên: ${formData.name.trim()}`,
      `Email: ${formData.email.trim()}`,
      "",
      formData.message.trim(),
    ].join("\n");
    const mailto = `mailto:support@lingo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
    toast.info("Hãy gửi email trong ứng dụng thư vừa được mở để hoàn tất liên hệ.");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="overflow-hidden bg-[#f2f7f3]">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_0.85fr] lg:py-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-800">
              <Sparkles className="h-4 w-4" />
              Chúng tôi luôn sẵn sàng lắng nghe
            </span>
            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl">
              Kết nối với <span className="text-emerald-700">Lingo.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Bạn cần hỗ trợ hoặc muốn chia sẻ góp ý? Hãy gửi lời nhắn cho chúng
              tôi, đội ngũ Lingo luôn sẵn lòng hỗ trợ.
            </p>
            <a
              href="#contact-form"
              className="mt-7 inline-flex h-12 items-center gap-2 rounded-xl bg-emerald-700 px-6 font-semibold text-white shadow-lg shadow-emerald-900/15 transition-colors hover:bg-emerald-800"
            >
              Gửi lời nhắn <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="mx-auto w-full max-w-[500px]">
            <Image
              src="/illustrations/learning-hero.svg"
              alt="Minh họa trao đổi và hỗ trợ học viên"
              width={640}
              height={480}
              className="block h-auto w-full"
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
        <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Email</CardTitle>
                <CardDescription>
                  Gửi email cho chúng tôi bất cứ lúc nào
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href="mailto:support@lingo.com"
                  className="text-green-600 hover:underline"
                >
                  support@lingo.com
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Gửi lời nhắn</CardTitle>
                <CardDescription>
                  Điền biểu mẫu, sau đó gửi email bằng ứng dụng thư của bạn
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-slate-600">
                  Nội dung chỉ được gửi sau khi bạn xác nhận gửi thư.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div id="contact-form" className="scroll-mt-24 md:col-span-2">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Gửi tin nhắn</CardTitle>
                <CardDescription>
                  Điền thông tin bên dưới và chúng tôi sẽ liên hệ lại với bạn sớm nhất
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Họ và tên *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Tiêu đề *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Tôi muốn hỏi về..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Nội dung *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Nhập nội dung tin nhắn của bạn..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                  >
                    Mở email để gửi
                  </Button>
                  <p className="text-center text-xs leading-5 text-slate-500">
                    Biểu mẫu sẽ mở ứng dụng email của bạn; tin nhắn chỉ được gửi
                    sau khi bạn xác nhận gửi thư.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
