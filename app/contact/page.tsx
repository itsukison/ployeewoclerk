"use client";

import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/send-contact-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: ""
        });
      } else {
        throw new Error(result.error || "送信に失敗しました");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-[#2F4F3F] overflow-hidden">
        <div className="absolute inset-0 bg-[#142d25]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/20 text-white/80 text-sm font-medium backdrop-blur-sm mb-6">
              <div className="w-2 h-2 bg-[#9fe870] rounded-full mr-2"></div>
              お問い合わせ
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              お気軽に
              <br />
              <span className="text-[#9fe870]">ご連絡</span>ください
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              プロイーに関するご質問、ご要望、技術的なサポートが必要でしたら、
              <br />
              お気軽にお問い合わせください。専門チームが迅速にお答えします。
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-[#163300] mb-6">
                サポート情報
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                プロイーチームは皆様のご質問にお答えし、最高の面接練習体験を提供することをお約束します。
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#9fe870]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#163300] mb-1">メールサポート</h3>
                    <p className="text-gray-600">ployee.officialcontact@gmail.com</p>
                    <p className="text-sm text-gray-500">24時間以内に返信いたします</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#9fe870]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#163300] mb-1">対応時間</h3>
                    <p className="text-gray-600">月〜金: 9:00 - 18:00</p>
                    <p className="text-sm text-gray-500">日本標準時（JST）</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#9fe870]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#163300] mb-1">よくある質問</h3>
                    <p className="text-gray-600">基本的な質問は料金ページのFAQをご確認ください</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-[#163300] mb-6">
                お問い合わせフォーム
              </h2>

              {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-[#9fe870]/20 border border-[#9fe870] rounded-xl">
                  <p className="text-[#163300] font-medium">
                    お問い合わせありがとうございました。24時間以内にご返信いたします。
                  </p>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-700 font-medium">
                    送信中にエラーが発生しました。もう一度お試しください。
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    お名前 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9fe870] focus:border-[#9fe870] outline-none"
                    placeholder="山田 太郎"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9fe870] focus:border-[#9fe870] outline-none"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    お問い合わせ種別 *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9fe870] focus:border-[#9fe870] outline-none"
                  >
                    <option value="">選択してください</option>
                    <option value="技術的な問題">技術的な問題</option>
                    <option value="料金・プランについて">料金・プランについて</option>
                    <option value="機能に関する質問">機能に関する質問</option>
                    <option value="企業向けソリューション">企業向けソリューション</option>
                    <option value="その他">その他</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    メッセージ *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9fe870] focus:border-[#9fe870] outline-none resize-none"
                    placeholder="お問い合わせ内容をお書きください..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#9fe870] text-[#163300] py-3 rounded-xl font-semibold hover:bg-[#8fd960] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "送信中..." : "送信する"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#163300] mb-4">
              よくある質問
            </h2>
            <p className="text-lg text-gray-600">
              お問い合わせ前に、こちらもご確認ください。
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#163300] mb-2">
                面接練習の回数制限はありますか？
              </h3>
              <p className="text-gray-600">
                無料プランでは月3回まで、プロプランでは無制限でご利用いただけます。
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#163300] mb-2">
                AI面接官はどのように機能しますか？
              </h3>
              <p className="text-gray-600">
                最新のAI技術を使用して、リアルタイムで質問を生成し、あなたの回答を分析します。音声認識と自然言語処理により、本物の面接官のような対話が可能です。
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#163300] mb-2">
                フィードバックはどのような形で提供されますか？
              </h3>
              <p className="text-gray-600">
                面接終了後、詳細な分析レポートが生成されます。話し方、内容の質、改善点などを具体的に指摘し、次回の面接に向けた提案を行います。
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#163300] mb-2">
                企業向けの導入は可能ですか？
              </h3>
              <p className="text-gray-600">
                はい、企業向けのソリューションもご用意しています。カスタマイズ可能な面接システムや、採用プロセスの効率化をサポートします。詳しくはお問い合わせください。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}