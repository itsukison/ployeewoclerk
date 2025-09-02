"use client";

import { useRouter } from "next/navigation";
import { CheckoutButton } from "@/components/payments/CheckoutButton";

export default function Pricing() {
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
              料金プラン
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              あなたに最適な
              <br />
              <span className="text-[#9fe870]">プラン</span>を選択
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              AI面接官との実践練習で、理想の企業への内定を実現しましょう。
              <br />
              無料プランから始めて、必要に応じてアップグレードできます。
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#163300] mb-4">
              シンプルで透明な料金体系
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              すべてのプランで高品質なAI面接練習をご利用いただけます。
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-3xl border-2 border-gray-200 p-6 relative">
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">フリー</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-[#163300]">¥0</span>
                  <span className="text-gray-500">/月</span>
                </div>
                <p className="text-gray-600 mb-6 text-sm">
                  まずはお試しで始めたい方に
                </p>
                
                <ul className="text-left space-y-3 mb-6 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#9fe870] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    月1回まで面接練習
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#9fe870] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    ES添削5回
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#9fe870] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    基本的なフィードバック
                  </li>
                </ul>
                
                <button 
                  onClick={() => router.push("/interview/new")}
                  className="w-full bg-gray-100 text-gray-900 py-3 rounded-full font-semibold hover:bg-gray-200 transition-colors"
                >
                  無料で始める
                </button>
              </div>
            </div>

            {/* Basic Plan - ¥500 Plan */}
            <div className="bg-white rounded-3xl border-2 border-gray-200 p-6 relative">
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">ベーシック</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-[#163300]">¥500</span>
                  <span className="text-gray-500">/月</span>
                </div>
                <p className="text-gray-600 mb-6 text-sm">
                  本格的に面接対策をしたい方に
                </p>
                
                <ul className="text-left space-y-3 mb-6 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#9fe870] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <strong>20回</strong>の面接練習
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#9fe870] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <strong>20回</strong>のES添削
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#9fe870] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    面接履歴の保存
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#9fe870] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    詳細なフィードバック
                  </li>
                </ul>
                
                <CheckoutButton 
                  planId="basic"
                  planName="ベーシックプラン"
                  price={500}
                  className="w-full"
                />
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-3xl border-2 border-[#9fe870] p-6 relative">
              <div className="absolute top-4 right-4">
                <div className="bg-[#9fe870] text-[#163300] px-3 py-1 rounded-full text-xs font-semibold">
                  人気
                </div>
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-bold text-[#163300] mb-2">プレミアム</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-[#163300]">¥2000</span>
                  <span className="text-gray-500">/月</span>
                </div>
                <p className="text-gray-600 mb-6 text-sm">
                  プロフェッショナルな面接対策
                </p>
                
                <ul className="text-left space-y-3 mb-6 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#9fe870] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <strong>無制限</strong>の面接練習
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#9fe870] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <strong>無制限</strong>のES添削
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#9fe870] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    詳細な分析レポート
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#9fe870] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    業界別面接対策
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#9fe870] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    24/7優先サポート
                  </li>
                </ul>
                
                <CheckoutButton 
                  planId="premium"
                  planName="プレミアムプラン"
                  price={2000}
                  className="w-full"
                />
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-3xl border-2 border-gray-200 p-6 relative">
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-2">エンタープライズ</h3>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-[#163300]">お問い合わせ</span>
                </div>
                <p className="text-gray-600 mb-6 text-sm">
                  企業・団体での導入をお考えの方に
                </p>
                
                <ul className="text-left space-y-3 mb-6 text-sm">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#9fe870] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    カスタマイズ可能
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#9fe870] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    専任サポート
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#9fe870] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    分析ダッシュボード
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#9fe870] mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    API統合
                  </li>
                </ul>
                
                <button 
                  onClick={() => router.push("/contact")}
                  className="w-full bg-[#163300] text-white py-3 rounded-full font-semibold hover:bg-[#163300]/90 transition-colors"
                >
                  お問い合わせ
                </button>
              </div>
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
              プロイーについてよくいただく質問にお答えします。
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#163300] mb-2">
                無料プランでできることは何ですか？
              </h3>
              <p className="text-gray-600">
                無料プランでは月1回まで面接練習ができ、基本的なフィードバックを受けることができます。プロイーの機能をお試しいただくのに十分な内容です。
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#163300] mb-2">
                プランの変更はいつでもできますか？
              </h3>
              <p className="text-gray-600">
                はい、いつでもプランの変更が可能です。アップグレードは即座に反映され、ダウングレードは次の請求サイクルから適用されます。
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#163300] mb-2">
                支払い方法は何が利用できますか？
              </h3>
              <p className="text-gray-600">
                クレジットカード（Visa、Mastercard、JCB、American Express）でのお支払いが可能です。安全な決済システムを使用しています。
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#163300] mb-2">
                キャンセルポリシーはありますか？
              </h3>
              <p className="text-gray-600">
                いつでもキャンセルが可能で、キャンセル料は一切かかりません。キャンセル後も現在の請求期間中はサービスをご利用いただけます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#163300]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            今すぐ始めて、理想の企業への内定を実現しよう
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            プロイーのAI面接官があなたの面接スキルを劇的に向上させます。まずは無料プランから始めてみませんか？
          </p>
          <button 
            onClick={() => router.push("/interview/new")}
            className="bg-[#9fe870] text-[#163300] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#8fd960] transition-colors shadow-lg"
          >
            無料で始める
          </button>
        </div>
      </section>
    </div>
  );
}