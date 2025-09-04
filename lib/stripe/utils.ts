"use server";

import { stripe, STRIPE_CONFIG, SERVER_PLANS, PlanId } from './config'
import { PLANS } from './plans'
import Stripe from 'stripe'
import { getUserProfile, updateUserProfile, updateUserSubscription, getEffectiveUserLimits } from '../supabase/auth'
import { auth } from '../supabase/auth'
import { supabaseAdmin } from '../supabase/client'

export interface CreateCheckoutSessionParams {
  planId: PlanId
  successUrl: string
  cancelUrl: string
  userId?: string
}

// Create Stripe checkout session
export async function createCheckoutSession({
  planId,
  successUrl,
  cancelUrl,
  userId
}: CreateCheckoutSessionParams) {
  try {
    const { userId: currentUserId } = await auth()
    const targetUserId = userId || currentUserId

    if (!targetUserId) {
      throw new Error('User not authenticated')
    }

    const profile = await getUserProfile(targetUserId)
    if (!profile) {
      throw new Error('User profile not found')
    }

    const plan = SERVER_PLANS[planId]
    if (planId === 'free' || !plan.stripePriceId) {
      throw new Error(`Plan ${planId} does not have a Stripe price ID`)
    }

    console.log(`Creating checkout session:`, {
      planId,
      priceId: plan.stripePriceId,
      userId: targetUserId,
      customerEmail: profile.email
    })

    // Validate price ID exists in Stripe
    try {
      const priceData = await stripe.prices.retrieve(plan.stripePriceId)
      console.log(`Price validation successful:`, {
        priceId: priceData.id,
        amount: priceData.unit_amount,
        currency: priceData.currency,
        active: priceData.active
      })
    } catch (priceError) {
      console.error('Invalid Stripe price ID:', plan.stripePriceId, priceError)
      throw new Error(`Invalid price configuration for plan ${planId}`)
    }

    // Create or retrieve Stripe customer
    let customerId = profile.stripe_customer_id
    
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile.email,
        name: profile.name || profile.email.split('@')[0],
        metadata: {
          userId: targetUserId
        }
      })
      customerId = customer.id

      // Update user profile with Stripe customer ID
      await updateUserProfile({ stripe_customer_id: customerId }, targetUserId)
    } else {
      // Validate existing customer exists in Stripe
      try {
        await stripe.customers.retrieve(customerId)
      } catch (customerError) {
        console.error('Invalid Stripe customer ID:', customerId, customerError)
        // Create new customer if old one is invalid
        const customer = await stripe.customers.create({
          email: profile.email,
          name: profile.name || profile.email.split('@')[0],
          metadata: {
            userId: targetUserId
          }
        })
        customerId = customer.id
        await updateUserProfile({ stripe_customer_id: customerId }, targetUserId)
      }
    }

    // Handle existing subscriptions based on upgrade vs downgrade logic
    let sessionConfig: any = {
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1
        }
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId: targetUserId,
        planId
      },
      subscription_data: {
        metadata: {
          userId: targetUserId,
          planId
        }
      }
    }

    try {
      const existingSubscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'active'
      })

      if (existingSubscriptions.data.length > 0) {
        console.log(`Found ${existingSubscriptions.data.length} existing active subscription(s) for customer ${customerId}`)
        
        // Determine if this is an upgrade or downgrade
        const currentSubscription: Stripe.Subscription = existingSubscriptions.data[0]
        const currentPriceId = (currentSubscription as any).items?.data?.[0]?.price?.id
        const newPriceId = plan.stripePriceId
        
        let currentPlan: string = 'free'
        if (currentPriceId === SERVER_PLANS.basic.stripePriceId) currentPlan = 'basic'
        if (currentPriceId === SERVER_PLANS.premium.stripePriceId) currentPlan = 'premium'
        
        const planHierarchy = { free: 0, basic: 1, premium: 2 }
        const currentPlanLevel = planHierarchy[currentPlan as keyof typeof planHierarchy] || 0
        const newPlanLevel = planHierarchy[planId as keyof typeof planHierarchy] || 0
        
        const isUpgrade = newPlanLevel > currentPlanLevel
        const isDowngrade = newPlanLevel < currentPlanLevel
        
        console.log(`Plan transition: ${currentPlan} → ${planId} (${isUpgrade ? 'UPGRADE' : isDowngrade ? 'DOWNGRADE' : 'SAME LEVEL'})`)
        
        if (isUpgrade) {
          // UPGRADE: Cancel existing subscription immediately and start new one
          console.log('Processing UPGRADE: cancelling existing subscription immediately')
          const cancelPromises = existingSubscriptions.data.map(subscription => {
            console.log(`Cancelling existing subscription for upgrade: ${subscription.id}`)
            return stripe.subscriptions.cancel(subscription.id)
          })
          
          await Promise.all(cancelPromises)
          console.log(`Cancelled ${existingSubscriptions.data.length} existing subscription(s) for upgrade`)
          
        } else if (isDowngrade) {
          // DOWNGRADE: Schedule cancellation at period end and create grandfathered limits
          console.log('Processing DOWNGRADE: scheduling cancellation at period end')
          
          const periodEnd = new Date((currentSubscription as any).current_period_end * 1000)
          
          // Update existing subscription to cancel at period end
          await stripe.subscriptions.update(currentSubscription.id, {
            cancel_at_period_end: true
          })
          
          console.log(`Scheduled existing subscription ${currentSubscription.id} to cancel at period end: ${periodEnd.toISOString()}`)
          
          // Create grandfathered limits for the user
          try {
            await supabaseAdmin.rpc('create_grandfathered_limit', {
              target_user_id: targetUserId,
              previous_plan: currentPlan
            })
            console.log(`Created grandfathered limits for user ${targetUserId} with previous plan: ${currentPlan}`)
          } catch (grandfatheredError) {
            console.error('Failed to create grandfathered limits:', grandfatheredError)
            // Continue with the process even if grandfathered limits creation fails
          }
          
          // Schedule the new subscription to start at the period end
          sessionConfig.subscription_data.trial_end = (currentSubscription as any).current_period_end
          sessionConfig.subscription_data.proration_behavior = 'none'
          console.log(`New subscription will start at: ${periodEnd.toISOString()}`)
          
        } else {
          // SAME LEVEL: This shouldn't happen in normal flow, but handle gracefully
          console.log('Same plan level detected - treating as renewal')
          const cancelPromises = existingSubscriptions.data.map(subscription => {
            console.log(`Cancelling existing subscription for renewal: ${subscription.id}`)
            return stripe.subscriptions.cancel(subscription.id)
          })
          
          await Promise.all(cancelPromises)
        }
      }
    } catch (subscriptionError) {
      console.error('Error handling existing subscriptions:', subscriptionError)
      // Continue with checkout creation even if subscription cleanup fails
    }

    const session = await stripe.checkout.sessions.create(sessionConfig)

    return { sessionId: session.id, url: session.url }
  } catch (error) {
    console.error('createCheckoutSession error:', error)
    throw new Error(`Failed to create checkout session: ${error}`)
  }
}

// Create customer portal session
export async function createCustomerPortalSession(returnUrl: string, userId?: string) {
  try {
    const { userId: currentUserId } = await auth()
    const targetUserId = userId || currentUserId

    if (!targetUserId) {
      throw new Error('User not authenticated')
    }

    const profile = await getUserProfile(targetUserId)
    if (!profile || !profile.stripe_customer_id) {
      throw new Error('User does not have a Stripe customer ID')
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: returnUrl
    })

    return { url: session.url }
  } catch (error) {
    console.error('createCustomerPortalSession error:', error)
    throw new Error(`Failed to create customer portal session: ${error}`)
  }
}

// Handle Stripe webhook events
export async function handleStripeWebhook(event: any) {
  try {
    console.log('Processing Stripe webhook:', {
      type: event.type,
      id: event.id,
      created: new Date(event.created * 1000).toISOString()
    })

    switch (event.type) {
      case 'customer.subscription.created':
        console.log('Handling subscription.created event')
        await handleSubscriptionChange(event.data.object)
        break
        
      case 'customer.subscription.updated':
        console.log('Handling subscription.updated event')
        await handleSubscriptionChange(event.data.object)
        break

      case 'customer.subscription.deleted':
        console.log('Handling subscription.deleted event')
        await handleSubscriptionCancellation(event.data.object)
        break

      case 'invoice.payment_succeeded':
        console.log('Handling payment_succeeded event')
        await handlePaymentSuccess(event.data.object)
        break

      case 'invoice.payment_failed':
        console.log('Handling payment_failed event')
        await handlePaymentFailure(event.data.object)
        break

      default:
        console.log('Unhandled webhook event type:', event.type)
    }

    console.log(`Webhook ${event.type} processed successfully`)
    return { received: true }
  } catch (error) {
    console.error('handleStripeWebhook error:', error)
    throw error
  }
}

// Handle subscription changes
async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  try {
    const customerId = (subscription as any).customer
    const subscriptionId = subscription.id
    const status = subscription.status
    
    // Get price ID to determine plan
    const priceId = (subscription as any).items?.data?.[0]?.price?.id
    let planId: PlanId = 'free'

    console.log(`Processing subscription change:`, {
      customer: customerId,
      subscriptionId,
      priceId,
      status,
      expectedBasicPrice: STRIPE_CONFIG.prices.basic,
      expectedPremiumPrice: STRIPE_CONFIG.prices.premium
    })

    // Map price ID to plan with detailed logging
    if (priceId === STRIPE_CONFIG.prices.basic) {
      planId = 'basic'
      console.log('✅ Matched BASIC plan price ID')
    } else if (priceId === STRIPE_CONFIG.prices.premium) {
      planId = 'premium'
      console.log('✅ Matched PREMIUM plan price ID')
    } else {
      console.log('❌ Price ID did not match any known plans, defaulting to free')
      console.log('Available price IDs:', {
        basic: STRIPE_CONFIG.prices.basic,
        premium: STRIPE_CONFIG.prices.premium
      })
      console.log('Received price ID:', priceId)
      
      // If we can't determine the plan, we should still try to update the subscription
      // but log this as a potential configuration issue
      console.warn('⚠️  CONFIGURATION WARNING: Unknown price ID detected. Please verify your Stripe price IDs in environment variables.')
    }

    console.log(`Final mapping: price ${priceId} → plan: ${planId}`)

    // Update user subscription via admin RPC to bypass RLS
    const result = await updateUserSubscription(
      customerId,
      subscriptionId,
      mapStripeStatusToLocal(status),
      planId
    )

    console.log(`Subscription update result:`, {
      customer: customerId,
      plan: planId,
      status,
      rpcResult: result,
      success: result === true
    })
  } catch (error) {
    console.error('handleSubscriptionChange error:', error)
    throw error
  }
}

// Handle subscription cancellation
async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  try {
    const customerId = (subscription as any).customer
    // Set status to canceled; RPC maps canceled/inactive to free plan
    await updateUserSubscription(customerId, undefined, 'canceled')
    console.log(`Cancelled subscription for customer ${customerId}`)
  } catch (error) {
    console.error('handleSubscriptionCancellation error:', error)
    throw error
  }
}

// Handle successful payment
async function handlePaymentSuccess(invoice: any) {
  try {
    const customerId = invoice.customer
    const subscriptionId = invoice.subscription

    if (subscriptionId) {
      console.log(`Processing payment success for customer ${customerId}, subscription ${subscriptionId}`)
      
      // Get the subscription to determine the plan
      try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId)
        const priceId = (subscription as any).items?.data?.[0]?.price?.id
        let planId: PlanId = 'free'

        // Map price ID to plan (same logic as handleSubscriptionChange)
        if (priceId === STRIPE_CONFIG.prices.basic) {
          planId = 'basic'
        } else if (priceId === STRIPE_CONFIG.prices.premium) {
          planId = 'premium'
        }

        console.log(`Payment success: mapped price ${priceId} to plan ${planId}`)

        // Update with both status and plan to ensure consistency
        await updateUserSubscription(customerId, subscriptionId, 'active', planId)
        console.log(`Payment succeeded for customer ${customerId}, set to plan ${planId}`)
      } catch (subError) {
        console.error('Failed to retrieve subscription for payment success:', subError)
        // Fallback: just update status without plan
        await updateUserSubscription(customerId, subscriptionId, 'active')
        console.log(`Payment succeeded for customer ${customerId} (status only)`)
      }
    }
  } catch (error) {
    console.error('handlePaymentSuccess error:', error)
    throw error
  }
}

// Handle failed payment
async function handlePaymentFailure(invoice: any) {
  try {
    const customerId = invoice.customer
    const subscriptionId = invoice.subscription

    if (subscriptionId) {
      await updateUserSubscription(customerId, subscriptionId, 'past_due')
      console.log(`Payment failed for customer ${customerId}`)
    }
  } catch (error) {
    console.error('handlePaymentFailure error:', error)
    throw error
  }
}

// Map Stripe subscription status to local status
function mapStripeStatusToLocal(stripeStatus: string): 'active' | 'inactive' | 'past_due' | 'canceled' | 'trialing' {
  switch (stripeStatus) {
    case 'active':
      return 'active'
    case 'trialing':
      return 'trialing'
    case 'past_due':
      return 'past_due'
    case 'canceled':
    case 'unpaid':
      return 'canceled'
    case 'incomplete':
    case 'incomplete_expired':
    default:
      return 'inactive'
  }
}

// Cancel user subscription
export async function cancelSubscription() {
  try {
    const response = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to cancel subscription')
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('cancelSubscription error:', error)
    throw error
  }
}

// Get subscription info for a user
export async function getUserSubscriptionInfo(userId?: string) {
  console.log('🔍 Getting user subscription info...')
  
  try {
    const { userId: currentUserId } = await auth()
    const targetUserId = userId || currentUserId
    console.log('👤 Target user ID:', targetUserId)

    if (!targetUserId) {
      console.error('❌ No user ID provided')
      throw new Error('User not authenticated')
    }

    const profile = await getUserProfile(targetUserId)
    console.log('📋 User profile loaded:', {
      exists: !!profile,
      plan: profile?.plan,
      stripeCustomerId: profile?.stripe_customer_id?.substring(0, 10) + '...',
      subscriptionId: profile?.subscription_id?.substring(0, 10) + '...'
    })
    
    if (!profile) {
      console.error('❌ User profile not found')
      throw new Error('User profile not found')
    }

    let subscriptionInfo = null
    
    // Only try to fetch Stripe subscription if we have both customer ID and subscription ID
    if (profile.stripe_customer_id && profile.subscription_id) {
      console.log('🔍 Fetching Stripe subscription details...')
      try {
        const subscription = await stripe.subscriptions.retrieve(profile.subscription_id)
        console.log('✅ Stripe subscription retrieved:', {
          id: subscription.id,
          status: subscription.status,
          cancelAtPeriodEnd: (subscription as any).cancel_at_period_end
        })
        
        subscriptionInfo = {
          id: subscription.id,
          status: subscription.status,
          current_period_start: new Date((subscription as any).current_period_start * 1000),
          current_period_end: new Date((subscription as any).current_period_end * 1000),
          cancel_at_period_end: (subscription as any).cancel_at_period_end
        }
      } catch (error) {
        console.error('❌ Failed to fetch Stripe subscription:', error)
        // Clear invalid subscription ID from user profile
        if (error instanceof Error && error.message.includes('No such subscription')) {
          console.log('🧹 Cleaning up invalid subscription ID from user profile')
          try {
            await updateUserProfile({ 
              subscription_id: undefined, 
              subscription_status: undefined 
            }, targetUserId)
            console.log('✅ Cleaned up invalid subscription data')
          } catch (cleanupError) {
            console.error('❌ Failed to cleanup subscription data:', cleanupError)
          }
        }
      }
    } else {
      console.log('ℹ️ No Stripe customer ID or subscription ID - skipping Stripe fetch')
    }

    // Get grandfathered limits information with error handling
    let grandfatheredInfo = null
    try {
      console.log('🔍 Checking for grandfathered limits...')
      const effectiveLimits = await getEffectiveUserLimits(targetUserId)
      console.log('📊 Effective limits:', {
        interviewLimit: effectiveLimits.interview_limit,
        esLimit: effectiveLimits.es_limit,
        isGrandfathered: effectiveLimits.is_grandfathered,
        planName: effectiveLimits.plan_name
      })
      
      if (effectiveLimits.is_grandfathered) {
        grandfatheredInfo = {
          isGrandfathered: true,
          grandfatheredPlan: effectiveLimits.plan_name || '上位プラン',
          expiresAt: effectiveLimits.expires_at ? new Date(effectiveLimits.expires_at) : null,
          limits: {
            interviews: effectiveLimits.interview_limit || 0,
            esCorrections: effectiveLimits.es_limit || 0
          }
        }
        console.log('🎁 Found grandfathered limits:', grandfatheredInfo)
      } else {
        console.log('ℹ️ No grandfathered limits found')
      }
    } catch (error) {
      console.error('❌ Failed to fetch grandfathered info:', error)
      // Continue without grandfathered info rather than failing completely
    }

    const result = {
      plan: profile.plan,
      planName: PLANS[profile.plan as PlanId]?.name || 'Unknown Plan',
      subscriptionStatus: profile.subscription_status,
      subscription: subscriptionInfo,
      stripeCustomerId: profile.stripe_customer_id,
      grandfathered: grandfatheredInfo
    }
    
    console.log('✅ Subscription info compiled successfully:', {
      plan: result.plan,
      planName: result.planName,
      hasSubscription: !!result.subscription,
      hasGrandfathered: !!result.grandfathered
    })
    
    return result
  } catch (error) {
    console.error('💥 getUserSubscriptionInfo error:', error)
    throw error
  }
}