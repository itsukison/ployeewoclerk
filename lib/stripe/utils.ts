"use server";

import { stripe, STRIPE_CONFIG, SERVER_PLANS, PlanId } from './config'
import { PLANS } from './plans'
import { getUserProfile, updateUserProfile } from '../supabase/auth'
import { getUserByStripeCustomerId } from '../supabase/users'
import { auth } from '../supabase/auth'

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
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
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
    })

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
    console.log('Processing Stripe webhook:', event.type)

    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSuccess(event.data.object)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailure(event.data.object)
        break

      default:
        console.log('Unhandled webhook event type:', event.type)
    }

    return { received: true }
  } catch (error) {
    console.error('handleStripeWebhook error:', error)
    throw error
  }
}

// Handle subscription changes
async function handleSubscriptionChange(subscription: any) {
  try {
    const customerId = subscription.customer
    const subscriptionId = subscription.id
    const status = subscription.status
    
    // Get price ID to determine plan
    const priceId = subscription.items?.data?.[0]?.price?.id
    let planId: PlanId = 'free'

    // Map price ID to plan
    if (priceId === STRIPE_CONFIG.prices.basic) {
      planId = 'basic'
    } else if (priceId === STRIPE_CONFIG.prices.premium) {
      planId = 'premium'
    }

    // Update user subscription
    const user = await getUserByStripeCustomerId(customerId)
    if (user) {
      await updateUserProfile({
        plan: planId,
        subscription_id: subscriptionId,
        subscription_status: mapStripeStatusToLocal(status)
      }, user.id)

      console.log(`Updated subscription for user ${user.id}: plan=${planId}, status=${status}`)
    } else {
      console.error('User not found for Stripe customer:', customerId)
    }
  } catch (error) {
    console.error('handleSubscriptionChange error:', error)
    throw error
  }
}

// Handle subscription cancellation
async function handleSubscriptionCancellation(subscription: any) {
  try {
    const customerId = subscription.customer

    const user = await getUserByStripeCustomerId(customerId)
    if (user) {
      await updateUserProfile({
        plan: 'free',
        subscription_status: 'canceled',
        subscription_id: undefined
      }, user.id)

      console.log(`Cancelled subscription for user ${user.id}`)
    } else {
      console.error('User not found for Stripe customer:', customerId)
    }
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
      const user = await getUserByStripeCustomerId(customerId)
      if (user) {
        await updateUserProfile({
          subscription_status: 'active'
        }, user.id)

        console.log(`Payment succeeded for user ${user.id}`)
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
      const user = await getUserByStripeCustomerId(customerId)
      if (user) {
        await updateUserProfile({
          subscription_status: 'past_due'
        }, user.id)

        console.log(`Payment failed for user ${user.id}`)
      }
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

// Get subscription info for a user
export async function getUserSubscriptionInfo(userId?: string) {
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

    let subscriptionInfo = null
    
    if (profile.stripe_customer_id && profile.subscription_id) {
      try {
        const subscription = await stripe.subscriptions.retrieve(profile.subscription_id)
        subscriptionInfo = {
          id: subscription.id,
          status: subscription.status,
          current_period_start: new Date((subscription as any).current_period_start * 1000),
          current_period_end: new Date((subscription as any).current_period_end * 1000),
          cancel_at_period_end: (subscription as any).cancel_at_period_end
        }
      } catch (error) {
        console.error('Failed to fetch Stripe subscription:', error)
      }
    }

    return {
      plan: profile.plan,
      planName: PLANS[profile.plan as PlanId]?.name || 'Unknown Plan',
      subscriptionStatus: profile.subscription_status,
      subscription: subscriptionInfo,
      stripeCustomerId: profile.stripe_customer_id
    }
  } catch (error) {
    console.error('getUserSubscriptionInfo error:', error)
    throw error
  }
}