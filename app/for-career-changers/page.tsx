"use client";

import { useRouter } from "next/navigation";

export default function ForCareerChangers() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-[#2F4F3F] overflow-hidden">
        <div className="absolute inset-0 bg-[#142d25]"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/20 text-white/80 text-sm font-medium backdrop-blur-sm mb-6">
              <div className="w-2 h-2 bg-[#9fe870] rounded-full mr-2"></div>
              転職者向け
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              転職成功への
              <br />
              <span className="text-[#9fe870]">新たな一歩</span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-8">
              キャリアチェンジを成功させるための専門的なAI面接練習を準備中です。
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-12">
            <div className="w-32 h-32 bg-[#9fe870]/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <svg className="w-16 h-16 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-[#163300] mb-6">
              Coming Soon!
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              転職者の皆様に特化したAI面接練習システムを開発中です。
              <br />
              より専門的で実践的な面接対策をご提供する予定です。
            </p>
          </div>

          {/* What's Coming */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-[#9fe870]/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#163300] mb-2">
                業界別面接対策
              </h3>
              <p className="text-gray-600 text-sm">
                IT、金融、コンサル、医療など、各業界に特化した面接練習とフィードバック
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-[#9fe870]/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#163300] mb-2">
                キャリア分析機能
              </h3>
              <p className="text-gray-600 text-sm">
                これまでの経験とスキルを分析し、最適なアピール方法をAIが提案
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-[#9fe870]/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#163300] mb-2">
                転職理由対策
              </h3>
              <p className="text-gray-600 text-sm">
                転職動機や志望理由を効果的に伝えるための専門的なトレーニング
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-[#9fe870]/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#163300] mb-2">
                年収交渉練習
              </h3>
              <p className="text-gray-600 text-sm">
                適切な年収交渉とキャリアプランについてのアドバイスと練習機会
              </p>
            </div>
          </div>

          {/* Notification Signup */}
          <div className="bg-[#9fe870]/10 rounded-3xl p-8 mb-8">
            <h3 className="text-xl font-bold text-[#163300] mb-4">
              リリース通知を受け取る
            </h3>
            <p className="text-gray-600 mb-6">
              転職者向け機能のリリース時にいち早くお知らせします
            </p>
            <button 
              onClick={() => router.push("/contact")}
              className="bg-[#9fe870] text-[#163300] px-8 py-3 rounded-full font-semibold hover:bg-[#8fd960] transition-colors"
            >
              通知を希望する
            </button>
          </div>

          {/* Current Features */}
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              現在は基本的な面接練習機能をご利用いただけます
            </p>
            <button 
              onClick={() => router.push("/interview/new")}
              className="bg-[#163300] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#163300]/90 transition-colors mr-4"
            >
              AI面接練習を体験
            </button>
            <button 
              onClick={() => router.push("/contact")}
              className="bg-transparent text-[#163300] border-2 border-[#163300] px-8 py-3 rounded-full font-semibold hover:bg-[#163300] hover:text-white transition-colors"
            >
              お問い合わせ
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}