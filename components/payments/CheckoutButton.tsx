"use client";

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { createCheckoutSession } from '@/lib/stripe/utils'
import { PlanId } from '@/lib/stripe/plans'

interface CheckoutButtonProps {
  planId: PlanId
  planName: string
  price: number
  className?: string
  children?: React.ReactNode
}

export function CheckoutButton({ 
  planId, 
  planName, 
  price, 
  className = "", 
  children 
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)

    try {
      const { url } = await createCheckoutSession({
        planId,
        successUrl: `${window.location.origin}/dashboard?success=true`,
        cancelUrl: `${window.location.origin}/pricing?canceled=true`
      })

      if (url) {
        window.location.href = url
      } else {
        throw new Error('Failed to create checkout session')
      }
    } catch (error: any) {
      console.error('Checkout error:', error)
      setError(error.message || 'お支払い処理に失敗しました')
      setLoading(false)
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      <Button
        onClick={handleCheckout}
        disabled={loading}
        className={`
          w-full h-12 bg-[#9fe870] text-[#163300] hover:bg-[#8fd960] 
          rounded-2xl font-semibold transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" color="#163300" />
            <span>処理中...</span>
          </div>
        ) : children ? (
          children
        ) : (
          `${planName}を始める - ¥${price.toLocaleString()}/月`
        )}
      </Button>
    </div>
  )
}