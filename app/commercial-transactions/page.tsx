import { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記 | プロイー",
  description:
    "プロイーの特定商取引法に基づく表記ページです。販売事業者情報、料金、支払方法、返品・キャンセルポリシーなどをご確認いただけます。",
  robots: {
    index: true,
    follow: true,
  },
};

export default function CommercialTransactionsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-8 sm:px-8 sm:py-12">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#163300] mb-8 text-center">
              特定商取引法に基づく表記
            </h1>

            <div className="space-y-8">
              {/* 販売事業者名 */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-semibold text-[#163300] mb-3">
                  販売事業者名
                </h2>
                <p className="text-gray-700">孫逸歓</p>
              </div>

              {/* 所在地 */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-semibold text-[#163300] mb-3">
                  所在地
                </h2>
                <p className="text-gray-700">東京都世田谷区桜3-9-24</p>
              </div>

              {/* 電話番号 */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-semibold text-[#163300] mb-3">
                  電話番号
                </h2>
                <p className="text-gray-700">080-8700-4730</p>
              </div>

              {/* メールアドレス */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-semibold text-[#163300] mb-3">
                  メールアドレス
                </h2>
                <p className="text-gray-700">
                  ployee.officialcontact@gmail.com
                </p>
              </div>

              {/* 販売価格 */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-semibold text-[#163300] mb-3">
                  販売価格
                </h2>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">
                      フリープラン
                    </h3>
                    <p className="text-gray-700">
                      無料（面接練習1回、ES添削5回まで）
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">
                      ベーシックプラン
                    </h3>
                    <p className="text-gray-700">
                      月額300円（税込）（面接練習10回、ES添削20回まで）
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-800 mb-2">
                      プレミアムプラン
                    </h3>
                    <p className="text-gray-700">
                      月額750円（税込）（面接練習30回、ES添削50回まで）
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  ※価格は全て税込価格です。消費税は価格に含まれております。
                </p>
              </div>

              {/* 支払方法 */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-semibold text-[#163300] mb-3">
                  支払方法
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    • クレジットカード決済（推奨）
                  </p>
                  <p className="text-gray-700">• 銀行振込</p>
                  <p className="text-gray-700">• コンビニ決済</p>
                </div>
                <p className="text-sm text-gray-600 mt-3">
                  ※推奨支払方法：クレジットカード決済（即時利用開始可能）
                </p>
              </div>

              {/* 商品引渡時期 */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-semibold text-[#163300] mb-3">
                  商品引渡時期
                </h2>
                <p className="text-gray-700">
                  オンラインサービス提供のため、お支払い完了後即時にアカウントが発行され、サービスをご利用いただけます。
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  ※クレジットカード決済の場合：即時利用開始
                  <br />
                  ※銀行振込・コンビニ決済の場合：入金確認後24時間以内にサービス開始
                </p>
              </div>

              {/* 返品・キャンセル */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-semibold text-[#163300] mb-3">
                  返品・キャンセル
                </h2>
                <div className="space-y-3">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800 mb-2">
                      キャンセルポリシー
                    </h3>
                    <p className="text-blue-700 text-sm">
                      サブスクリプションサービスは、次回更新日の24時間前までにキャンセル可能です。
                      キャンセル後も現在のプラン期間終了までサービスをご利用いただけます。
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-medium text-green-800 mb-2">
                      返金ポリシー
                    </h3>
                    <p className="text-green-700 text-sm">
                      サービス開始から7日以内であれば、理由を問わず全額返金いたします。
                      返金をご希望の場合は、上記メールアドレスまでご連絡ください。
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-medium text-yellow-800 mb-2">
                      注意事項
                    </h3>
                    <p className="text-yellow-700 text-sm">
                      デジタルコンテンツの性質上、一度ご利用いただいたサービス内容の返品はできません。
                      ただし、サービスに重大な不具合がある場合は例外とします。
                    </p>
                  </div>
                </div>
              </div>

              {/* 追加費用 */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-semibold text-[#163300] mb-3">
                  追加費用
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    • 消費税：価格に含まれております
                  </p>
                  <p className="text-gray-700">• 決済手数料：無料</p>
                  <p className="text-gray-700">
                    • 送料：オンラインサービスのため不要
                  </p>
                  <p className="text-gray-700">
                    • その他：追加費用は一切ございません
                  </p>
                </div>
              </div>

              {/* サービス内容 */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-semibold text-[#163300] mb-3">
                  サービス内容
                </h2>
                <p className="text-gray-700 mb-3">
                  AI面接練習サービス（Webサービス／サブスクリプション）
                </p>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• AI面接官との実践的な面接練習</p>
                  <p>• リアルタイム音声認識・分析</p>
                  <p>• 個別フィードバック・改善提案</p>
                  <p>• ES（エントリーシート）添削サービス</p>
                  <p>• 面接練習履歴の保存・管理</p>
                </div>
              </div>

              {/* 利用規約・プライバシーポリシー */}
              <div className="pb-6">
                <h2 className="text-lg font-semibold text-[#163300] mb-3">
                  関連規約
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    •{" "}
                    <a href="/terms" className="text-[#163300] hover:underline">
                      利用規約
                    </a>
                  </p>
                  <p className="text-gray-700">
                    •{" "}
                    <a
                      href="/privacy"
                      className="text-[#163300] hover:underline"
                    >
                      プライバシーポリシー
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* 最終更新日 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                最終更新日：2025年1月27日
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
