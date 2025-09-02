"use client";

import { useRouter } from "next/navigation";

export default function ForCompanies() {
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
              企業向けソリューション
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              採用プロセスを
              <br />
              <span className="text-[#9fe870]">革新</span>しませんか？
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              プロイーのAI面接官技術を御社の採用プロセスに導入し、
              <br />
              効率的で客観的な人材評価を実現します。
            </p>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#163300] mb-4">
              採用担当者の課題を解決
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              現在の採用プロセスで抱えている問題を、AI技術で根本的に改善します。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-8 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">時間コストの増大</h3>
              <p className="text-gray-600">
                多数の候補者との面接で人事担当者の時間が圧迫され、質の高い面接に集中できない状況
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 002 2v2a2 2 0 002 2h2a2 2 0 012-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2H9z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">効率化</h3>
              <p className="text-gray-600">
                面接、特に一次面接はAI面接が担う時代。採用プロセスを効率化するには必須。
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 rounded-2xl">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">記録・分析の不足</h3>
              <p className="text-gray-600">
                面接内容の詳細な記録や分析が困難で、採用判断の根拠が曖昧
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Overview */}
      <section className="py-20 bg-[#9fe870]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#163300] mb-4">
              プロイーのAI面接官ソリューション
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              御社の採用ニーズに合わせてカスタマイズされたAI面接官を提供します。
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-[#163300] mb-6">
                カスタマイズ可能なAI面接官
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#9fe870] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#163300] font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#163300] mb-2">企業文化に合わせた質問設計</h4>
                    <p className="text-gray-600">
                      御社の価値観や求める人材像に基づいた質問を生成。業界特有のスキルや経験を重視した面接を実現
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#9fe870] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#163300] font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#163300] mb-2">職種別評価基準の設定</h4>
                    <p className="text-gray-600">
                      営業、エンジニア、マネジメントなど、各職種に最適化された評価基準でAIが候補者を分析
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#9fe870] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#163300] font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#163300] mb-2">統一された評価基準</h4>
                    <p className="text-gray-600">
                      全候補者を同じ基準で公平に評価。面接官による個人差を排除し、客観性を保証
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <h4 className="text-xl font-bold text-[#163300] mb-6">導入効果の例</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">採用効率</span>
                    <span className="text-2xl font-bold text-[#9fe870]">++</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-[#9fe870] h-3 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">時間短縮</span>
                    <span className="text-2xl font-bold text-[#9fe870]">++</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-[#9fe870] h-3 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">評価の一貫性</span>
                    <span className="text-2xl font-bold text-[#9fe870]">+++</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-[#9fe870] h-3 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#163300] mb-4">
              導入のメリット
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              プロイーのAI面接官が御社にもたらす具体的な価値
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#9fe870]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#163300] mb-4">効率性向上</h3>
              <p className="text-gray-600 text-sm">
                初回スクリーニングをAIが担当することで、人事担当者は最終候補者との質の高い面接に集中
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#9fe870]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#163300] mb-4">客観的評価</h3>
              <p className="text-gray-600 text-sm">
                一貫した基準での公平な評価。バイアスを排除した科学的なアプローチで人材を選定
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#9fe870]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#163300] mb-4">コスト削減</h3>
              <p className="text-gray-600 text-sm">
                採用プロセスの自動化により、人件費と時間コストを大幅に削減
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#9fe870]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#163300] mb-4">品質向上</h3>
              <p className="text-gray-600 text-sm">
                詳細な分析データに基づく採用判断で、ミスマッチを防止し、定着率を向上
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#163300] mb-4">
              導入プロセス
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              専門チームがスムーズな導入をサポートします
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#163300] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="font-semibold text-[#163300] mb-2">ヒアリング</h3>
              <p className="text-sm text-gray-600">
                御社の採用課題と要求を詳細にヒアリング
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#163300] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="font-semibold text-[#163300] mb-2">カスタマイズ</h3>
              <p className="text-sm text-gray-600">
                御社専用のAI面接官システムを設計・開発
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#163300] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="font-semibold text-[#163300] mb-2">テスト運用</h3>
              <p className="text-sm text-gray-600">
                小規模でのテスト運用を実施し、調整を行う
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#163300] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="font-semibold text-[#163300] mb-2">本格導入</h3>
              <p className="text-sm text-gray-600">
                全面導入と継続的なサポートを提供
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#163300]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            御社の採用プロセスを次のレベルへ
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            プロイーのAI面接官ソリューションで、効率的で公平な採用を実現しませんか？
            <br />
            まずは無料相談から始めましょう。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push("/contact")}
              className="bg-[#9fe870] text-[#163300] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#8fd960] transition-colors shadow-lg"
            >
              無料相談を申し込む
            </button>
            <button 
              onClick={() => {
                // Create a sample demo request
                router.push("/contact");
              }}
              className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-[#163300] transition-colors"
            >
              デモを依頼する
            </button>
          </div>
          <p className="text-white/60 text-sm mt-6">
            導入検討からアフターサポートまで、専門チームが全面的にサポートします
          </p>
        </div>
      </section>
    </div>
  );
}