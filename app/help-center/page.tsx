"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HelpCenter() {
  const router = useRouter();
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
        body: JSON.stringify({
          ...formData,
          subject: `[ヘルプセンター] ${formData.subject}`, // Add help center prefix
        }),
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
      console.error("Error submitting help form:", error);
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
              ヘルプセンター
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              サポートが
              <br />
              <span className="text-[#9fe870]">必要</span>ですか？
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              プロイーの使用中に問題が発生した場合や、ご不明な点がございましたら、
              <br />
              専門サポートチームがお手伝いします。お気軽にお問い合わせください。
            </p>
          </div>
        </div>
      </section>

      {/* Quick Help Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#163300] mb-4">
              よくある問題と解決方法
            </h2>
            <p className="text-lg text-gray-600">
              まずはこちらで解決方法をお探しください
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#9fe870]/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#163300] mb-2">マイクが動作しない</h3>
              <p className="text-gray-600 text-sm mb-4">
                ブラウザの設定でマイクのアクセス許可を確認してください。Chrome/Safari の設定から音声入力を許可する必要があります。
              </p>
             
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#9fe870]/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#163300] mb-2">カメラが映らない</h3>
              <p className="text-gray-600 text-sm mb-4">
                カメラのアクセス許可とWebカメラの接続を確認してください。他のアプリケーションでカメラを使用していないかも確認してください。
              </p>
              <button className="text-[#9fe870] hover:text-[#8fd960] text-sm font-medium">
                
              </button>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#9fe870]/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#163300] mb-2">フィードバックが表示されない</h3>
              <p className="text-gray-600 text-sm mb-4">
                面接終了後、フィードバック生成には数秒かかります。ページを更新せずにお待ちください。それでも表示されない場合はお問い合わせください。
              </p>

            </div>

            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#9fe870]/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#163300] mb-2">料金について</h3>
              <p className="text-gray-600 text-sm mb-4">
                無料プランでは月1回まで利用可能です。プロプランにアップグレードすることで無制限利用が可能になります。
              </p>
              <button 
                onClick={() => router.push("/pricing")}
                className="text-[#9fe870] hover:text-[#8fd960] text-sm font-medium"
              >
                料金プランを見る →
              </button>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#9fe870]/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#163300] mb-2">アカウント設定</h3>
              <p className="text-gray-600 text-sm mb-4">
                プロフィール情報の変更、パスワードリセット、アカウント削除などのアカウント関連の設定について説明します。
              </p>
             
        
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-[#9fe870]/20 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#163300] mb-2">面接のコツ</h3>
              <p className="text-gray-600 text-sm mb-4">
                効果的な面接練習のコツや、AIフィードバックの活用方法について詳しく説明します。
              </p>
           
            </div>
          </div>
        </div>
      </section>

      {/* Support Form Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#163300] mb-4">
              それでも解決しない場合
            </h2>
            <p className="text-lg text-gray-600">
              専門サポートチームにお問い合わせください
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Contact Information */}
            <div>
              <h3 className="text-2xl font-bold text-[#163300] mb-6">
                サポート連絡先
              </h3>
              <p className="text-lg text-gray-600 mb-8">
                技術的な問題から使い方のご質問まで、どんなことでもお気軽にお問い合わせください。
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#9fe870]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#163300] mb-1">メールサポート</h4>
                    <p className="text-gray-600">ployee.officialcontact@gmail.com</p>
                    <p className="text-sm text-gray-500">通常24時間以内に返信</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#9fe870]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#163300] mb-1">サポート時間</h4>
                    <p className="text-gray-600">平日 9:00 - 18:00</p>
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
                    <h4 className="font-semibold text-[#163300] mb-1">緊急時のサポート</h4>
                    <p className="text-gray-600">重要な問題については優先対応</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Form */}
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-[#163300] mb-6">
                サポート依頼フォーム
              </h3>

              {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-[#9fe870]/20 border border-[#9fe870] rounded-xl">
                  <p className="text-[#163300] font-medium">
                    サポート依頼を受け付けました。担当者から24時間以内にご連絡いたします。
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
                    問題のカテゴリ *
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
                    <option value="音声・カメラの問題">音声・カメラの問題</option>
                    <option value="フィードバックの問題">フィードバックの問題</option>
                    <option value="アカウント・ログイン">アカウント・ログイン</option>
                    <option value="料金・プラン">料金・プラン</option>
                    <option value="使い方がわからない">使い方がわからない</option>
                    <option value="その他">その他</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    詳細な説明 *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#9fe870] focus:border-[#9fe870] outline-none resize-none"
                    placeholder="問題の詳細、エラーメッセージ、使用環境（ブラウザ、デバイス）などをお書きください..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#9fe870] text-[#163300] py-3 rounded-xl font-semibold hover:bg-[#8fd960] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "送信中..." : "サポートに問い合わせる"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}