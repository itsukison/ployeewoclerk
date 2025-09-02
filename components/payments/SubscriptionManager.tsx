"use client";

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { createCustomerPortalSession, getUserSubscriptionInfo } from '@/lib/stripe/utils'
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
}

export function SubscriptionManager() {
  const { user } = useAuth()
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
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
          <div className="mt-6 pt-4 border-t border-gray-200">
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
            
            <p className="text-xs text-gray-500 text-center mt-2">
              お支払い方法の変更、プランの変更、キャンセルなど
            </p>
          </div>
        )}
      </div>
    </div>
  )
}