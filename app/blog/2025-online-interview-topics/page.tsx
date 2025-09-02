import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "【2025年最新】オンライン面接で必ず聞かれるTopics 7選｜新卒就活生必見",
  description:
    "2025年新卒就活ではオンライン面接が標準に。企業75%以上がハイブリッド採用を導入。必ず聞かれる面接Topics7選を厳選解説。自己紹介、志望動機、緊張対策など実践的アドバイス満載。",
  keywords: [
    "オンライン面接",
    "2025年就活",
    "面接対策",
    "新卒採用",
    "ハイブリッド採用",
    "SNS活用",
    "就活面接",
    "自己紹介",
    "志望動機",
  ],
};

export default function OnlineInterviewArticle() {
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
            <span>オンライン面接Topics 7選</span>
          </nav>

          <div className="mb-6">
            <span className="text-sm text-gray-600">
              面接対策 • 2025年8月23日 • 7分読む
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-4">
            【2025年最新】オンライン面接で必ず聞かれるTopics 7選
          </h1>

          <p className="text-lg text-gray-600">
            2025年新卒就活では、オンライン面接が標準になりました。企業の75%以上がハイブリッド採用を導入する中で、必ず聞かれる面接Topicsを7つ厳選して解説します。
          </p>
        </div>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-black mb-6">
          Topics1: 自己紹介の最適化（30秒バージョン）
        </h2>

        <p className="text-gray-700 mb-4">
          <strong>面接官の心理:</strong>{" "}
          最初の30秒で応募者の「伝える力」を判断します。
        </p>

        <div className="mb-8">
          <p className="font-semibold text-black mb-3">実例:</p>
          <div className="space-y-3">
            <div className="border-l-4 border-gray-300 pl-4">
              <p className="text-sm font-semibold text-gray-700">NG例</p>
              <p className="text-gray-600">
                「私は〇〇大学の△△です。性格は明るくて...」
              </p>
            </div>
            <div className="border-l-4 border-[#163300] pl-4">
              <p className="text-sm font-semibold text-[#163300]">OK例</p>
              <p className="text-gray-700">
                「私は〇〇大学でHR研究に4年間取り組み、3つのインターンで人事の実務を経験しました。貴社のESG経営に共感し、採用戦略に貢献したいです」
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-black mb-6">
          Topics2: 志望動機の「3層構造」
        </h2>

        <p className="text-gray-700 mb-4">
          2025年は「企業研究の深さ」が重要になります。
        </p>

        <div className="mb-8">
          <p className="font-semibold text-black mb-4">3層構造の例:</p>
          <ol className="space-y-3">
            <li className="flex">
              <span className="font-bold text-[#163300] mr-3">1.</span>
              <div>
                <strong>表層:</strong> 「貴社の事業に共感」
              </div>
            </li>
            <li className="flex">
              <span className="font-bold text-[#163300] mr-3">2.</span>
              <div>
                <strong>中層:</strong> 「具体的なプロジェクト名」
              </div>
            </li>
            <li className="flex">
              <span className="font-bold text-[#163300] mr-3">3.</span>
              <div>
                <strong>深層:</strong> 「そのプロジェクトが社会に与える影響」
              </div>
            </li>
          </ol>
        </div>

        <h2 className="text-2xl font-bold text-black mb-6">
          Topics3: 数値化自己PRの作り方
        </h2>

        <p className="text-gray-700 mb-4">
          <strong>面接官が好むデータ:</strong> 具体的な成果を示す数字
        </p>

        <ul className="space-y-2 mb-8">
          <li className="border-l-4 border-[#163300] pl-4">
            「ゼミで5人チームをリードし、研究発表会で100人中1位を獲得」
          </li>
          <li className="border-l-4 border-[#163300] pl-4">
            「アルバイトで売上を150%向上、客単価を500円から750円に改善」
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-black mb-6">
          Topics4: オンライン面接の環境設定
        </h2>

        <p className="text-gray-700 mb-4">
          2025年必須スキル：<strong>動画選考</strong>対応力
        </p>

        <div className="mb-8">
          <p className="font-semibold text-black mb-4">チェックリスト:</p>
          <ul className="space-y-2">
            <li>• カメラアングル: 目線がレンズ中央</li>
            <li>• 照明: 窓からの自然光 or リングライト</li>
            <li>• 背景: シンプルな白or淡い色</li>
            <li>• 音声: ヘッドセット使用</li>
          </ul>
        </div>

        <h2 className="text-2xl font-bold text-black mb-6">
          Topics5: 緊張対策の「3呼吸法」
        </h2>

        <p className="text-gray-700 mb-4">面接前5分で実践可能:</p>
        <ol className="space-y-3 mb-8">
          <li className="flex">
            <span className="font-bold text-[#163300] mr-3">1.</span>
            <div>
              <strong>4-4-4呼吸:</strong> 4秒吸って4秒止めて4秒吐く
            </div>
          </li>
          <li className="flex">
            <span className="font-bold text-[#163300] mr-3">2.</span>
            <div>
              <strong>肩回し:</strong> 3回前回し→3回後ろ回し
            </div>
          </li>
          <li className="flex">
            <span className="font-bold text-[#163300] mr-3">3.</span>
            <div>
              <strong>微笑み練習:</strong> 鏡で口角を上げて5秒キープ
            </div>
          </li>
        </ol>

        <h2 className="text-2xl font-bold text-black mb-6">
          Topics6: 逆質問の「差別化戦略」
        </h2>

        <p className="font-semibold text-black mb-4">
          面接官が印象に残る質問TOP3:
        </p>
        <ol className="space-y-2 mb-8">
          <li>1. 「このポジションで成功する人材の共通点は？」</li>
          <li>2. 「チームの雰囲気を3つキーワードで教えてください」</li>
          <li>3. 「1年後、私がどんな成果を出していたら良いですか？」</li>
        </ol>

        <h2 className="text-2xl font-bold text-black mb-6">
          Topics7: SNS活用での企業リサーチ
        </h2>

        <p className="text-gray-700 mb-4">
          2025年は<strong>SNS採用</strong>が本格化しています。
        </p>

        <div className="mb-8">
          <p className="font-semibold text-black mb-4">おすすめの調べ方:</p>
          <ul className="space-y-2">
            <li>
              • <strong>LinkedIn:</strong> 人事担当者の投稿をチェック
            </li>
            <li>
              • <strong>Twitter:</strong> 企業公式アカウントのハッシュタグ分析
            </li>
            <li>
              • <strong>Instagram:</strong> 社内イベントの雰囲気を確認
            </li>
          </ul>
        </div>

        {/* Related Articles */}
        <div className="border-t border-gray-200 pt-8 mt-12">
          <h3 className="text-xl font-bold text-black mb-4">関連記事</h3>
          <div className="space-y-2">
            <Link
              href="/blog/spi-master-topics"
              className="block text-[#163300] hover:underline"
            >
              【2025年完全版】SPI攻略Topics｜就活生が1ヶ月でマスターする勉強法
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
            {["オンライン面接", "2025年就活", "面接対策", "新卒採用"].map(
              (tag) => (
                <span key={tag} className="text-sm text-gray-600">
                  #{tag}
                </span>
              )
            )}
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
