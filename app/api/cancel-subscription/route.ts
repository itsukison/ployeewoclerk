import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/config'
import { auth, getUserProfile } from '@/lib/supabase/auth'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    const profile = await getUserProfile(userId)
    if (!profile || !profile.stripe_customer_id) {
      return NextResponse.json(
        { error: 'No Stripe customer found' },
        { status: 400 }
      )
    }

    // Get active subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'active'
    })

    if (subscriptions.data.length === 0) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 400 }
      )
    }

    // Cancel all active subscriptions
    const cancelPromises = subscriptions.data.map(subscription =>
      stripe.subscriptions.cancel(subscription.id)
    )

    await Promise.all(cancelPromises)

    console.log(`Cancelled ${subscriptions.data.length} subscription(s) for customer ${profile.stripe_customer_id}`)

    return NextResponse.json({ 
      success: true,
      message: 'Subscription cancelled successfully'
    })
  } catch (error) {
    console.error('Cancel subscription error:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}