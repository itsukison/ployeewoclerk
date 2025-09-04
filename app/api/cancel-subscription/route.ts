import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/config'
import { auth, getUserProfile, updateUserProfile } from '@/lib/supabase/auth'
import { supabaseAdmin } from '@/lib/supabase/client'

export async function POST(request: NextRequest) {
  console.log('🔄 Starting subscription cancellation process...')
  
  try {
    // Step 1: Authenticate user
    const { userId } = await auth()
    console.log('✅ User authentication:', userId ? 'Success' : 'Failed')
    
    if (!userId) {
      console.error('❌ Authentication failed: No user ID')
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      )
    }

    // Step 2: Get user profile
    console.log('🔍 Fetching user profile...')
    const profile = await getUserProfile(userId)
    console.log('📋 User profile:', {
      exists: !!profile,
      plan: profile?.plan,
      stripeCustomerId: profile?.stripe_customer_id,
      subscriptionId: profile?.subscription_id
    })
    
    if (!profile) {
      console.error('❌ No user profile found')
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 400 }
      )
    }

    if (!profile.stripe_customer_id) {
      console.error('❌ No Stripe customer ID found')
      return NextResponse.json(
        { error: 'No Stripe customer found' },
        { status: 400 }
      )
    }

    // Step 3: Get the user's current plan before cancellation
    const currentUserPlan = profile.plan
    console.log('📊 Current user plan:', currentUserPlan)

    // Step 4: Get active subscriptions for this customer
    console.log('🔍 Fetching active subscriptions from Stripe...')
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'active'
    })
    
    console.log('📋 Active subscriptions found:', subscriptions.data.length)
    subscriptions.data.forEach((sub, index) => {
      console.log(`  ${index + 1}. ID: ${sub.id}, Status: ${sub.status}`)
    })

    if (subscriptions.data.length === 0) {
      console.log('⚠️ No active subscriptions found - updating user to free plan')
      
      // Update user to free plan even if no active subscription
      try {
        await updateUserProfile({
          plan: 'free',
          subscription_status: 'canceled',
          subscription_id: undefined
        }, userId)
        console.log('✅ Updated user to free plan')
      } catch (updateError) {
        console.error('❌ Failed to update user plan:', updateError)
      }
      
      return NextResponse.json({
        success: true,
        message: 'Already on free plan - no active subscription to cancel'
      })
    }

    // Step 5: Cancel all active subscriptions
    console.log('🚫 Cancelling subscriptions in Stripe...')
    const cancelResults = []
    
    for (const subscription of subscriptions.data) {
      try {
        console.log(`  Cancelling subscription: ${subscription.id}`)
        const cancelledSub = await stripe.subscriptions.cancel(subscription.id)
        cancelResults.push({ id: subscription.id, success: true, status: cancelledSub.status })
        console.log(`  ✅ Successfully cancelled: ${subscription.id}`)
      } catch (cancelError) {
        console.error(`  ❌ Failed to cancel ${subscription.id}:`, cancelError)
        cancelResults.push({ id: subscription.id, success: false, error: cancelError })
      }
    }

    const successfulCancellations = cancelResults.filter(r => r.success).length
    console.log(`✅ Successfully cancelled ${successfulCancellations}/${subscriptions.data.length} subscription(s)`)

    // Step 6: Update user to free plan in database immediately
    console.log('💾 Updating user plan in database...')
    try {
      await updateUserProfile({
        plan: 'free',
        subscription_status: 'canceled',
        subscription_id: undefined
      }, userId)
      console.log('✅ Updated user to free plan in database')
    } catch (updateError) {
      console.error('❌ Failed to update user plan in database:', updateError)
      // Continue anyway - the webhook should handle this
    }

    // Step 7: Create grandfathered limits if user was on paid plan
    if (currentUserPlan === 'basic' || currentUserPlan === 'premium') {
      console.log('🎁 Creating grandfathered limits...')
      try {
        const { error: rpcError } = await supabaseAdmin.rpc('create_grandfathered_limit', {
          target_user_id: userId,
          previous_plan: currentUserPlan
        })

        if (rpcError) {
          console.error('❌ Failed to create grandfathered limit:', rpcError)
        } else {
          console.log(`✅ Created grandfathered limits for ${currentUserPlan} plan`)
        }
      } catch (rpcError) {
        console.error('❌ Error calling create_grandfathered_limit RPC:', rpcError)
        // Don't fail the entire process if grandfathered limits fail
      }
    } else {
      console.log('ℹ️ No grandfathered limits needed (user was on free plan)')
    }

    console.log('🎉 Subscription cancellation process completed successfully')
    return NextResponse.json({ 
      success: true,
      message: 'Subscription cancelled successfully',
      cancelledSubscriptions: successfulCancellations,
      previousPlan: currentUserPlan
    })
    
  } catch (error) {
    console.error('💥 Cancel subscription error:', error)
    
    // Provide more specific error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : 'No stack trace'
    
    console.error('Error details:', {
      message: errorMessage,
      stack: errorStack
    })
    
    return NextResponse.json(
      { 
        error: 'Failed to cancel subscription',
        details: errorMessage
      },
      { status: 500 }
    )
  }
}