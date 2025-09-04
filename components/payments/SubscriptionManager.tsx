"use client";

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { createCustomerPortalSession, getUserSubscriptionInfo, cancelSubscription } from '@/lib/stripe/utils'
import { useAuth } from '@/components/auth/AuthProvider'

interface SubscriptionInfo {
  plan: string
  planName: string
  subscriptionStatus: string | null
  subscription: {
    id: string
    status: string
    current_period_start: Date
    current_period_end: Date
    cancel_at_period_end: boolean
  } | null
  stripeCustomerId: string | null
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

export function SubscriptionManager() {
  const { user } = useAuth()
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadSubscriptionInfo()
    }
  }, [user])

  const loadSubscriptionInfo = async () => {
    try {
      setLoading(true)
      const info = await getUserSubscriptionInfo()
      setSubscriptionInfo(info)
    } catch (error: any) {
      console.error('Failed to load subscription info:', error)
      setError('サブスクリプション情報の取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    if (!subscriptionInfo?.stripeCustomerId) {
      setError('Stripeカスタマー情報が見つかりません')
      return
    }

    setActionLoading(true)
    setError(null)

    try {
      const { url } = await createCustomerPortalSession(`${window.location.origin}/dashboard`)
      
      if (url) {
        window.location.href = url
      } else {
        throw new Error('Failed to create customer portal session')
      }
    } catch (error: any) {
      console.error('Customer portal error:', error)
      setError(error.message || '管理ページへのアクセスに失敗しました')
      setActionLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('本当にサブスクリプションをキャンセルしてフリープランに戻りますか？')) {
      return
    }

    setCancelLoading(true)
    setError(null)

    try {
      await cancelSubscription()
      // Reload subscription info to reflect changes
      await loadSubscriptionInfo()
      alert('サブスクリプションがキャンセルされました。フリープランに戻りました。')
    } catch (error: any) {
      console.error('Cancel subscription error:', error)
      setError(error.message || 'サブスクリプションのキャンセルに失敗しました')
    } finally {
      setCancelLoading(false)
    }
  }

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'trialing':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'past_due':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'canceled':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusText = (status: string | null) => {
    switch (status) {
      case 'active':
        return 'アクティブ'
      case 'trialing':
        return 'トライアル中'
      case 'past_due':
        return '支払い遅延'
      case 'canceled':
        return 'キャンセル済み'
      case 'inactive':
        return '非アクティブ'
      default:
        return '不明'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner size="lg" color="#163300" />
      </div>
    )
  }

  if (!subscriptionInfo) {
    return (
      <div className="p-6 rounded-2xl bg-gray-50 border border-gray-200">
        <p className="text-gray-600">サブスクリプション情報が取得できませんでした</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm">
        <h3 className="text-xl font-bold text-[#163300] mb-4">
          現在のプラン
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">プラン名</span>
            <span className="font-semibold text-[#163300]">
              {subscriptionInfo.planName}
            </span>
          </div>

          {subscriptionInfo.grandfathered?.isGrandfathered && (
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm font-semibold text-amber-800">継続特典適用中</span>
              </div>
              <div className="space-y-1 text-xs text-amber-700">
                <div className="flex justify-between">
                  <span>適用プラン:</span>
                  <span className="font-medium">{subscriptionInfo.grandfathered.grandfatheredPlan}</span>
                </div>
                <div className="flex justify-between">
                  <span>面接練習:</span>
                  <span className="font-medium">{subscriptionInfo.grandfathered.limits.interviews}回/月</span>
                </div>
                <div className="flex justify-between">
                  <span>ES添削:</span>
                  <span className="font-medium">{subscriptionInfo.grandfathered.limits.esCorrections}回/月</span>
                </div>
                {subscriptionInfo.grandfathered.expiresAt && (
                  <div className="flex justify-between pt-1 border-t border-amber-200">
                    <span>特典終了:</span>
                    <span className="font-medium">
                      {subscriptionInfo.grandfathered.expiresAt.toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {subscriptionInfo.subscriptionStatus && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">ステータス</span>
              <span className={`
                px-3 py-1 rounded-full text-sm font-medium border
                ${getStatusColor(subscriptionInfo.subscriptionStatus)}
              `}>
                {getStatusText(subscriptionInfo.subscriptionStatus)}
              </span>
            </div>
          )}

          {subscriptionInfo.subscription && (
            <>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">次回更新日</span>
                <span className="text-gray-800">
                  {subscriptionInfo.subscription.current_period_end.toLocaleDateString('ja-JP')}
                </span>
              </div>

              {subscriptionInfo.subscription.cancel_at_period_end && (
                <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <p className="text-sm text-yellow-700">
                    このサブスクリプションは次回更新日にキャンセルされます。
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {subscriptionInfo.stripeCustomerId && (
          <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
            <Button
              onClick={handleManageSubscription}
              disabled={actionLoading}
              className="w-full h-12 bg-[#9fe870] text-[#163300] hover:bg-[#8fd960] rounded-2xl font-semibold"
            >
              {actionLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" color="#163300" />
                  <span>読み込み中...</span>
                </div>
              ) : (
                'サブスクリプションを管理'
              )}
            </Button>
            
            {subscriptionInfo.plan !== 'free' && (
              <Button
                onClick={handleCancelSubscription}
                disabled={cancelLoading}
                className="w-full h-12 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-2xl font-semibold"
              >
                {cancelLoading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" color="#dc2626" />
                    <span>処理中...</span>
                  </div>
                ) : (
                  'フリープランに戻る'
                )}
              </Button>
            )}
            
            <p className="text-xs text-gray-500 text-center">
              お支払い方法の変更、プランの変更、キャンセルなど
            </p>
          </div>
        )}
      </div>
    </div>
  )
}