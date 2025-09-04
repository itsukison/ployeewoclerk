import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/config'
import { auth, getUserProfile } from '@/lib/supabase/auth'
import { supabaseAdmin } from '@/lib/supabase/client'

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

    // Get the user's current plan before cancellation
    const currentUserPlan = profile.plan

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

    // If the user was on a paid plan, create grandfathered limits
    if (currentUserPlan === 'basic' || currentUserPlan === 'premium') {
      try {
        // Call the RPC function to create grandfathered limits
        const { error: rpcError } = await supabaseAdmin.rpc('create_grandfathered_limit', {
          target_user_id: userId,
          previous_plan: currentUserPlan
        })

        if (rpcError) {
          console.error('Failed to create grandfathered limit:', rpcError)
        } else {
          console.log(`Created grandfathered limits for user ${userId} who downgraded from ${currentUserPlan}`)
        }
      } catch (rpcError) {
        console.error('Error calling create_grandfathered_limit RPC:', rpcError)
      }
    }

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