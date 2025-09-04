"use client";

import React, { useEffect, useState } from "react";
import Head from "next/head";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { CheckoutButton } from "@/components/payments/CheckoutButton";
import { PLANS } from "@/lib/stripe/plans";
import { getUserSubscriptionInfo, cancelSubscription } from "@/lib/stripe/utils";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface SubscriptionInfo {
  plan: string
  planName: string
  subscriptionStatus: string | null
  grandfathered?: {
    isGrandfathered: boolean
    grandfatheredPlan: string
    expiresAt: Date | null
    limits: {
      interviews: number
      esCorrections: number
    }
  } | null
}

export default function BillingPage() {
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    document.title = "料金プラン | プロイー - AI面接練習プラットフォーム";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "プロイーの料金プランをご確認ください。無料プランから始めて、AI面接練習で面接スキルを向上させましょう。"
      );
    }

    // Load subscription info
    const loadSubscriptionInfoOnMount = async () => {
      try {
        const info = await getUserSubscriptionInfo()
        setSubscriptionInfo(info)
      } catch (error) {
        console.error('Failed to load subscription info:', error)
        setError('サブスクリプション情報の読み込みに失敗しました')
      } finally {
        setLoading(false)
      }
    }

    loadSubscriptionInfoOnMount()
  }, []);

  const handleCancelSubscription = async () => {
    if (!confirm('本当にサブスクリプションをキャンセルしてフリープランに戻りますか？')) {
      return
    }

    console.log('🔄 Starting cancellation process from UI...')
    setCancelLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      console.log('📞 Calling cancelSubscription API...')
      const result = await cancelSubscription()
      console.log('✅ Cancel subscription API response:', result)
      
      // Add a small delay to allow any webhooks to process
      console.log('⏳ Waiting for system sync...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Reload subscription info to reflect changes
      console.log('🔄 Reloading subscription info...')
      await loadSubscriptionInfo()
      
      setSuccessMessage('キャンセルが完了しました。フリープランに戻りました。')
      console.log('🎉 Cancellation completed successfully from UI')
    } catch (error: any) {
      console.error('💥 Cancel subscription error in UI:', error)
      
      // Provide more helpful error messages
      let errorMessage = 'サブスクリプションのキャンセルに失敗しました'
      
      if (error.message) {
        if (error.message.includes('No active subscription')) {
          errorMessage = 'アクティブなサブスクリプションが見つかりません。既にキャンセル済みの可能性があります。'
        } else if (error.message.includes('authentication')) {
          errorMessage = '認証エラーが発生しました。再度ログインしてお試しください。'
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'ネットワークエラーが発生しました。接続を確認してお試しください。'
        } else {
          errorMessage = `エラー: ${error.message}`
        }
      }
      
      setError(errorMessage)
      
      // Try to reload subscription info anyway to check current state
      try {
        console.log('🔄 Attempting to reload subscription info after error...')
        await loadSubscriptionInfo()
      } catch (reloadError) {
        console.error('❌ Failed to reload subscription info after error:', reloadError)
      }
    } finally {
      setCancelLoading(false)
    }
  }

  const loadSubscriptionInfo = async () => {
    try {
      setLoading(true)
      setError(null)
      const info = await getUserSubscriptionInfo()
      setSubscriptionInfo(info)
    } catch (error) {
      console.error('Failed to load subscription info:', error)
      setError('サブスクリプション情報の読み込みに失敗しました')
    } finally {
      setLoading(false)
    }
  }
  return (
    <ProtectedRoute>
      <Head>
        <title>料金プラン | プロイー - AI面接練習プラットフォーム</title>
        <meta
          name="description"
          content="プロイーの料金プランをご確認ください。無料プランから始めて、AI面接練習で面接スキルを向上させましょう。"
        />
      </Head>

        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                料金プラン
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
                あなたの面接練習ニーズに合わせて最適なプランをお選びください
              </p>
            </div>
            
            {error && (
              <div className="mb-8 p-4 rounded-lg bg-red-50 border border-red-200 max-w-2xl mx-auto">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            {successMessage && (
              <div className="mb-8 p-4 rounded-lg bg-green-50 border border-green-200 max-w-2xl mx-auto">
                <p className="text-sm text-green-600 text-center">{successMessage}</p>
              </div>
            )}

            {subscriptionInfo?.grandfathered?.isGrandfathered && subscriptionInfo.grandfathered.limits && (
              <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-amber-800">継続特典が適用中</h3>
                    <p className="text-sm text-amber-700">
                      {subscriptionInfo.grandfathered.grandfatheredPlan || '上位プラン'}の利用制限を継続してご利用いただけます
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-amber-700">
                  <div className="flex justify-between">
                    <span>面接練習:</span>
                    <span className="font-semibold">{subscriptionInfo.grandfathered.limits.interviews || 0}回/月</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ES添削:</span>
                    <span className="font-semibold">{subscriptionInfo.grandfathered.limits.esCorrections || 0}回/月</span>
                  </div>
                  {subscriptionInfo.grandfathered.expiresAt && (
                    <div className="flex justify-between pt-2 border-t border-amber-200">
                      <span>特典終了予定:</span>
                      <span className="font-semibold">
                        {subscriptionInfo.grandfathered.expiresAt.toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" color="#163300" />
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {/* Free Plan */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all flex flex-col">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">フリープラン</h3>
                    <div className="text-3xl font-bold text-gray-900 mb-1">¥0</div>
                    <p className="text-gray-500">月額</p>
                  </div>
                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">面接練習 1回/月</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">ES添削 5回/月</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">基本的なフィードバック</span>
                    </li>
                  </ul>
                  <div className="mt-auto">
                    {subscriptionInfo?.plan === 'free' ? (
                      <button disabled className="w-full py-3 px-4 bg-gray-100 text-gray-400 rounded-lg font-semibold cursor-not-allowed">
                        現在のプラン
                      </button>
                    ) : (
                      <button 
                        onClick={handleCancelSubscription}
                        disabled={cancelLoading}
                        className="w-full py-3 px-4 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-semibold border border-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancelLoading ? '処理中...' : 'フリープランに戻る'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Basic Plan */}
                <div className="bg-white rounded-2xl p-8 border-2 border-[#9fe870] hover:border-[#8fd960] transition-all relative flex flex-col">
                  {subscriptionInfo?.plan !== 'basic' && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-[#9fe870] text-[#163300] px-3 py-1 rounded-full text-sm font-semibold">
                        人気
                      </span>
                    </div>
                  )}
                  {subscriptionInfo?.plan === 'basic' && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        現在のプラン
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">ベーシックプラン</h3>
                    <div className="text-3xl font-bold text-gray-900 mb-1">¥300</div>
                    <p className="text-gray-500">月額</p>
                  </div>
                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">面接練習 <strong>10回/月</strong></span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">ES添削 <strong>20回/月</strong></span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">詳細なフィードバック</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">業界別面接対策</span>
                    </li>
                  </ul>
                  <div className="mt-auto">
                    {subscriptionInfo?.plan === 'basic' ? (
                      <button disabled className="w-full py-3 px-4 bg-gray-100 text-gray-400 rounded-lg font-semibold cursor-not-allowed">
                        現在のプラン
                      </button>
                    ) : (
                      <CheckoutButton 
                        planId="basic"
                        planName={PLANS.basic.name}
                        price={PLANS.basic.price}
                        className="w-full"
                      />
                    )}
                  </div>
                </div>

                {/* Premium Plan */}
                <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all relative flex flex-col">
                  {subscriptionInfo?.plan === 'premium' && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        現在のプラン
                      </span>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">プレミアムプラン</h3>
                    <div className="text-3xl font-bold text-gray-900 mb-1">¥750</div>
                    <p className="text-gray-500">月額</p>
                  </div>
                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">面接練習 <strong>30回/月</strong></span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">ES添削 <strong>50回/月</strong></span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">AI による詳細分析</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">業界別面接対策</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600">優先サポート</span>
                    </li>
                  </ul>
                  <div className="mt-auto">
                    {subscriptionInfo?.plan === 'premium' ? (
                      <button disabled className="w-full py-3 px-4 bg-gray-100 text-gray-400 rounded-lg font-semibold cursor-not-allowed">
                        現在のプラン
                      </button>
                    ) : (
                      <CheckoutButton 
                        planId="premium"
                        planName={PLANS.premium.name}
                        price={PLANS.premium.price}
                        className="w-full"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </ProtectedRoute>
    );
  }
