import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title:
    "【2025年完全ガイド】グループディスカッションで内定をもらうTopics 10選",
  description:
    "2025年新卒就活でグループディスカッションは重要な選考ステップ。GDで合格する確率はわずか25%。内定者が実践しているGD攻略Topicsを10選ご紹介。",
  keywords: [
    "グループディスカッション",
    "GD攻略",
    "2025年就活",
    "ケーススタディ",
    "リーダーシップ",
    "新卒採用",
    "内定獲得",
  ],
};

export default function GDArticle() {
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
            <span>グループディスカッションTopics</span>
          </nav>

          <div className="mb-6">
            <span className="text-sm text-gray-600">
              グループディスカッション • 2025年8月23日 • 9分読む
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-black mb-4">
            【2025年完全ガイド】グループディスカッションで内定をもらうTopics
            10選
          </h1>

          <p className="text-lg text-gray-600">
            2025年新卒就活でグループディスカッションは重要な選考ステップ。GDで合格する確率はわずか25%。内定者が実践しているGD攻略Topicsを10選ご紹介します。
          </p>
        </div>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-black mb-6">
          Topics1: 2025年GDの最新トレンド
        </h2>

        <p className="font-semibold text-black mb-3">新しい評価軸:</p>
        <ul className="space-y-2 text-gray-700 mb-8">
          <li>• SNS活用: リアルタイム情報共有能力</li>
          <li>• ハイブリッド対応: オンラインと対面の使い分け</li>
          <li>• ESG視点: 持続可能性への配慮</li>
        </ul>

        <h2 className="text-2xl font-bold text-black mb-6">
          Topics2: 「最初の発言」で勝負を決める
        </h2>

        <p className="text-gray-700 mb-4">
          <strong>鉄則:</strong> 3分以内に「存在感」を示す
        </p>

        <p className="font-semibold text-black mb-4">成功パターン3選:</p>
        <ol className="space-y-3 mb-8">
          <li className="flex">
            <span className="font-bold text-[#163300] mr-3">1.</span>
            <div>
              <strong>時間管理型:</strong>{" "}
              「では3分でアジェンダを確認し、15分で議論、2分でまとめましょう」
            </div>
          </li>
          <li className="flex">
            <span className="font-bold text-[#163300] mr-3">2.</span>
            <div>
              <strong>問題整理型:</strong>{" "}
              「本質的な課題は△△ではないでしょうか」
            </div>
          </li>
          <li className="flex">
            <span className="font-bold text-[#163300] mr-3">3.</span>
            <div>
              <strong>アイスブレイク型:</strong>{" "}
              「皆さんの専門性を活かした意見交換にしたいです」
            </div>
          </li>
        </ol>

        <h2 className="text-2xl font-bold text-black mb-6">
          Topics3: 「話すタイミング」を掴む技術
        </h2>

        <p className="font-semibold text-black mb-4">発言チャンスの見極め方:</p>
        <ul className="space-y-2 mb-6 text-gray-700">
          <li>• 誰かが意見を終えた瞬間</li>
          <li>• 議論が停滞している時</li>
          <li>• 反対意見が出た直後</li>
        </ul>

        <p className="font-semibold text-black mb-2">理想は「7:2:1法則」:</p>
        <ul className="text-gray-700 mb-8">
          <li>• 7回: 意見追加・質問</li>
          <li>• 2回: 議論の主導</li>
          <li>• 1回: まとめ・提案</li>
        </ul>

        <h2 className="text-2xl font-bold text-black mb-6">
          Topics4-6: 「議論を活性化」する魔法のフレーズ
        </h2>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <p className="font-semibold text-black mb-3">相手の意見を広げる:</p>
            <ul className="text-gray-700 text-sm space-y-2">
              <li>
                「〇〇さんのご意見に関連して、△△の観点も重要かと思います」
              </li>
              <li>
                「なるほど、ではその考えを具体例で説明していただけますか？」
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-black mb-3">議論を深める:</p>
            <ul className="text-gray-700 text-sm space-y-2">
              <li>「逆に、リスクはどのようなものがありますか？」</li>
              <li>「他社事例ではどのようなアプローチが成功していますか？」</li>
            </ul>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-black mb-6">
          Topics7: オンラインGD対応の必須テクニック
        </h2>

        <p className="font-semibold text-black mb-4">必須準備リスト:</p>
        <ul className="space-y-2 mb-8">
          <li>• マイクテスト（音量確認）</li>
          <li>• カメラアングル調整（目線レベル）</li>
          <li>• インターネット接続確認</li>
          <li>• 資料共有準備（画面共有練習）</li>
        </ul>

        <h2 className="text-2xl font-bold text-black mb-6">
          Topics8: 「ケーススタディ」攻略法
        </h2>

        <p className="font-semibold text-black mb-4">頻出テーマ5選:</p>
        <ol className="space-y-2 mb-6 text-gray-700">
          <li>1. 新商品企画: ターゲット設定と4P戦略</li>
          <li>2. 売上向上: 現状分析と改善提案</li>
          <li>3. コスト削減: 優先順位と実施計画</li>
          <li>4. 市場参入: リスクと対策</li>
          <li>5. 組織改革: ステークホルダー分析</li>
        </ol>

        <p className="font-semibold text-black mb-4">基本フレームワーク:</p>
        <ul className="space-y-2 mb-8 text-gray-700">
          <li>
            <strong>3C分析:</strong> Customer, Competitor, Company
          </li>
          <li>
            <strong>4P:</strong> Product, Price, Place, Promotion
          </li>
          <li>
            <strong>PDCA:</strong> Plan, Do, Check, Act
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-black mb-6">
          Topics9: 「リーダー役」を演じる技術
        </h2>

        <p className="text-gray-700 mb-4">
          <strong>リーダーの3つの役割:</strong>
        </p>

        <ol className="space-y-3 mb-8">
          <li className="flex">
            <span className="font-bold text-[#163300] mr-3">1.</span>
            <div>
              <strong>議論の方向性提示:</strong>{" "}
              「では△△について話し合いましょう」
            </div>
          </li>
          <li className="flex">
            <span className="font-bold text-[#163300] mr-3">2.</span>
            <div>
              <strong>時間管理:</strong>{" "}
              「残り5分ですので、まとめに入りましょう」
            </div>
          </li>
          <li className="flex">
            <span className="font-bold text-[#163300] mr-3">3.</span>
            <div>
              <strong>メンバー巻き込み:</strong>{" "}
              「〇〇さん、どう思われますか？」
            </div>
          </li>
        </ol>

        <h2 className="text-2xl font-bold text-black mb-6">
          Topics10: 「評価される」話し方
        </h2>

        <p className="text-gray-700 mb-4">
          <strong>企業が見ている5つのポイント:</strong>
        </p>

        <div className="space-y-3 mb-8">
          <div className="border-l-4 border-[#163300] pl-4">
            <p className="font-semibold text-black">論理的思考</p>
            <p className="text-gray-600 text-sm">結論ファースト</p>
          </div>
          <div className="border-l-4 border-[#163300] pl-4">
            <p className="font-semibold text-black">コミュニケーション</p>
            <p className="text-gray-600 text-sm">分かりやすさ</p>
          </div>
          <div className="border-l-4 border-[#163300] pl-4">
            <p className="font-semibold text-black">リーダーシップ</p>
            <p className="text-gray-600 text-sm">巻き込み力</p>
          </div>
          <div className="border-l-4 border-[#163300] pl-4">
            <p className="font-semibold text-black">協調性</p>
            <p className="text-gray-600 text-sm">他者尊重</p>
          </div>
          <div className="border-l-4 border-[#163300] pl-4">
            <p className="font-semibold text-black">創造性</p>
            <p className="text-gray-600 text-sm">独自視点</p>
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
              href="/blog/spi-master-topics"
              className="block text-[#163300] hover:underline"
            >
              【2025年完全版】SPI攻略Topics｜就活生が1ヶ月でマスターする勉強法
            </Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-8 border-t border-gray-200 mt-8">
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              "グループディスカッション",
              "GD攻略",
              "2025年就活",
              "ケーススタディ",
            ].map((tag) => (
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
