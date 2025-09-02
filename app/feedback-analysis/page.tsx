"use client";

import { useRouter } from "next/navigation";

export default function FeedbackAnalysis() {
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
              フィードバック分析
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              詳細な分析で
              <br />
              <span className="text-[#9fe870]">成長</span>を実感
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              プロイーのAI面接官は、あなたの面接パフォーマンスを多角的に分析し、
              <br />
              具体的で実行可能な改善提案を提供します。
            </p>
          </div>
        </div>
      </section>

      {/* Analysis Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#163300] mb-4">
              AI分析の特徴
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              従来の面接練習では得られない、詳細で客観的な分析をご体験ください。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#9fe870]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#163300] mb-4">リアルタイム分析</h3>
              <p className="text-gray-600">
                面接中の音声、表情、話し方をリアルタイムで分析し、即座にフィードバックを生成します。
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#9fe870]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#163300] mb-4">多角的評価</h3>
              <p className="text-gray-600">
                内容の質や話し方など、複数の要素を総合的に評価し、バランスの取れた分析を提供します。
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#9fe870]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#163300] mb-4">個別化提案</h3>
              <p className="text-gray-600">
                あなたの特性と改善が必要な点を特定し、パーソナライズされた具体的な改善提案を行います。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Feedback Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#163300] mb-4">
              フィードバックサンプル
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              実際にプロイーが生成するフィードバックの例をご覧ください。
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Sample Feedback Image */}
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-3xl p-8 shadow-lg border">
                <h3 className="text-xl font-bold text-[#163300] mb-6">面接分析レポート</h3>
                
                {/* Overall Score */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">総合スコア</span>
                    <span className="text-2xl font-bold text-[#163300]">85/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-[#9fe870] h-3 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>

                {/* Individual Metrics */}
                <div className="space-y-4 mb-8">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">内容の質</span>
                      <span className="text-sm font-bold text-[#163300]">90/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#9fe870] h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">話し方</span>
                      <span className="text-sm font-bold text-[#163300]">78/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#ff8c5a] h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">志望動機</span>
                      <span className="text-sm font-bold text-[#163300]">88/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-[#9fe870] h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Strengths and Areas for Improvement */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-[#163300] mb-3 flex items-center">
                      <svg className="w-4 h-4 text-[#9fe870] mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      強み
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 論理的で構造化された回答</li>
                      <li>• 志望動機が説得力ある</li>
                      <li>• 一貫性がみえる</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-[#163300] mb-3 flex items-center">
                      <svg className="w-4 h-4 text-[#ff8c5a] mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      改善点
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• 言葉が詰まらずに話せるように</li>
                      <li>• より具体的な実績</li>
                      <li>• 結論を先に述べる</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="order-1 lg:order-2">
              <h3 className="text-2xl font-bold text-[#163300] mb-6">
                このようなフィードバックが得られます
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#9fe870] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#163300] font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#163300] mb-2">総合スコア</h4>
                    <p className="text-gray-600">
                      全体的なパフォーマンスを100点満点で評価。面接の成功度を一目で把握できます。
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#9fe870] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#163300] font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#163300] mb-2">項目別分析</h4>
                    <p className="text-gray-600">
                      自己紹介、ガクチカ、志望動機、自身の強み・弱みの観点から詳細に分析。どの分野が得意で、どの分野に改善が必要かが明確になります。
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-[#9fe870] rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-[#163300] font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-[#163300] mb-2">具体的な改善提案</h4>
                    <p className="text-gray-600">
                      「面接時に自身の経験を語る際、過去の成功体験に加え、失敗から学んだことも交えることで、より深い自己分析ができるようになります。」といった具体的な提案をします。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#163300] mb-4">
              分析の仕組み
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              最新のAI技術を使用して、人間の面接官では不可能な精度と客観性で分析します。
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#9fe870]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#163300]">1</span>
              </div>
              <h3 className="font-semibold text-[#163300] mb-2">音声分析</h3>
              <p className="text-sm text-gray-600">
                話すスピード、声のトーン、間の取り方などを詳細に分析
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#9fe870]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#163300]">2</span>
              </div>
              <h3 className="font-semibold text-[#163300] mb-2">内容分析</h3>
              <p className="text-sm text-gray-600">
                回答の論理性、具体性、質問への適切性を評価
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#9fe870]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#163300]">3</span>
              </div>
              <h3 className="font-semibold text-[#163300] mb-2">業界への知識</h3>
              <p className="text-sm text-gray-600">
                業界へ対する熱意や「本気度」をはかる
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#9fe870]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-[#163300]">4</span>
              </div>
              <h3 className="font-semibold text-[#163300] mb-2">総合評価</h3>
              <p className="text-sm text-gray-600">
                全ての要素を統合し、具体的な改善提案を生成
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#163300]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            詳細なフィードバックで面接スキルを向上させよう
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            プロイーのAI分析を体験して、客観的で具体的なフィードバックから学びましょう。今すぐ無料で始められます。
          </p>
          <button 
            onClick={() => router.push("/interview/new")}
            className="bg-[#9fe870] text-[#163300] px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#8fd960] transition-colors shadow-lg mr-4"
          >
            無料で体験する
          </button>
          <button 
            onClick={() => router.push("/pricing")}
            className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-[#163300] transition-colors"
          >
            料金プランを見る
          </button>
        </div>
      </section>
    </div>
  );
}