import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "【2025年完全版】SPI攻略Topics｜就活生が1ヶ月でマスターする勉強法",
  description:
    "2025年新卒採用でSPIは依然として最重要課題。企業の85%以上が導入しており、合格率はわずか25%。1ヶ月で確実に突破するSPI攻略Topicsを徹底解説。",
  keywords: [
    "SPI攻略",
    "適性検査",
    "2025年就活",
    "言語非言語問題",
    "性格検査",
    "勉強法",
    "新卒採用",
  ],
};

export default function SPIArticle() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-[#163300]">
              ホーム
            </Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-[#163300]">
              ブログ
            </Link>
            <span className="mx-2">/</span>
            <span>SPI攻略Topics</span>
          </nav>

          <div className="mb-6">
            <span className="text-sm text-gray-600">
              適性検査 • 2025年8月23日 • 8分読む
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-4">
            【2025年完全版】SPI攻略Topics｜就活生が1ヶ月でマスターする勉強法
          </h1>

          <p className="text-lg text-gray-600">
            2025年新卒採用でSPIは依然として最重要課題。企業の85%以上が導入しており、合格率はわずか25%。1ヶ月で確実に突破するSPI攻略Topicsを徹底解説します。
          </p>
        </div>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-black mb-6">
          SPI攻略の基本戦略
        </h2>

        <p className="text-gray-700 mb-6">
          <strong>重要ポイント:</strong>{" "}
          SPIは「言語分野」「非言語分野」「性格検査」の3つで構成されています。効率的な学習には、まず自分の弱点分野を特定することが重要です。
        </p>

        <h3 className="text-xl font-bold text-black mb-4">
          1. 言語分野の攻略法
        </h3>

        <div className="space-y-4 mb-8">
          <div className="border-l-4 border-[#163300] pl-4">
            <h4 className="font-semibold text-black mb-2">語彙力強化</h4>
            <p className="text-gray-700">
              毎日30語の新しい語彙を覚える。同義語・対義語・慣用句を重点的に学習。
            </p>
          </div>

          <div className="border-l-4 border-[#163300] pl-4">
            <h4 className="font-semibold text-black mb-2">読解問題対策</h4>
            <p className="text-gray-700">
              文章の要約練習を1日3題。論理的な文章構造を理解する力を養成。
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-black mb-4">
          2. 非言語分野の攻略法
        </h3>

        <div className="space-y-4 mb-8">
          <div className="border-l-4 border-[#163300] pl-4">
            <h4 className="font-semibold text-black mb-2">数的推理</h4>
            <p className="text-gray-700">
              割合、確率、速度の計算問題を重点的に練習。公式を暗記するよりも理解を重視。
            </p>
          </div>

          <div className="border-l-4 border-[#163300] pl-4">
            <h4 className="font-semibold text-black mb-2">図表読み取り</h4>
            <p className="text-gray-700">
              グラフや表からの情報抽出練習。短時間で正確に読み取る技術を身につける。
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-black mb-4">3. 性格検査の対策</h3>

        <p className="text-gray-700 mb-6">
          <strong>重要な注意点:</strong>{" "}
          性格検査では一貫性が重要です。嘘をつかず、自分らしい回答を心がけましょう。企業が求める人物像を過度に意識しすぎないことがポイントです。
        </p>

        <h2 className="text-2xl font-bold text-black mb-6">
          1ヶ月学習スケジュール
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h4 className="font-bold text-black mb-3">第1-2週目</h4>
            <ul className="space-y-2 text-gray-700">
              <li>• 基礎問題集で全分野を一通り学習</li>
              <li>• 弱点分野の特定</li>
              <li>• 語彙力強化（毎日30語）</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-black mb-3">第3-4週目</h4>
            <ul className="space-y-2 text-gray-700">
              <li>• 弱点分野の集中対策</li>
              <li>• 模擬試験で実践練習</li>
              <li>• 時間配分の最適化</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-black mb-6">おすすめ参考書</h2>

        <div className="space-y-4 mb-8">
          <div>
            <h4 className="font-semibold text-black mb-2">
              1. 『SPI3&テストセンター完全対策』
            </h4>
            <p className="text-gray-600">
              基礎から応用まで幅広くカバー。初学者におすすめ。
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-black mb-2">
              2. 『史上最強SPI&テストセンター超実戦問題集』
            </h4>
            <p className="text-gray-600">
              実践的な問題が豊富。仕上げの段階で活用。
            </p>
          </div>
        </div>

        {/* Related Articles */}
        <div className="border-t border-gray-200 pt-8 mt-12">
          <h3 className="text-xl font-bold text-black mb-4">関連記事</h3>
          <div className="space-y-2">
            <Link
              href="/blog/2025-online-interview-topics"
              className="block text-[#163300] hover:underline"
            >
              【2025年最新】オンライン面接で必ず聞かれるTopics 7選
            </Link>
            <Link
              href="/blog/group-discussion-topics"
              className="block text-[#163300] hover:underline"
            >
              【2025年完全ガイド】グループディスカッションで内定をもらうTopics
              10選
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-8 border-t border-gray-200 mt-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {["SPI攻略", "適性検査", "2025年就活", "勉強法"].map((tag) => (
              <span key={tag} className="text-sm text-gray-600">
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <Link href="/blog" className="text-[#163300] hover:underline">
              ← ブログ一覧に戻る
            </Link>
            <Link
              href="/interview/new"
              className="px-4 py-2 bg-[#163300] text-white rounded hover:bg-[#9fe870] hover:text-[#163300]"
            >
              AI面接練習を試す
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
