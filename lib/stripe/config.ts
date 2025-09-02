import Stripe from 'stripe'
import { PLANS, PlanId } from './plans'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
  typescript: true
})

// Stripe price IDs for different plans
export const STRIPE_CONFIG = {
  prices: {
    basic: process.env.STRIPE_BASIC_PRICE_ID!,
    premium: process.env.STRIPE_PREMIUM_PRICE_ID!
  },
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!
}

// Server-side plans with Stripe price IDs
export const SERVER_PLANS = {
  free: {
    ...PLANS.free,
    stripePriceId: null
  },
  basic: {
    ...PLANS.basic,
    stripePriceId: process.env.STRIPE_BASIC_PRICE_ID!
  },
  premium: {
    ...PLANS.premium,
    stripePriceId: process.env.STRIPE_PREMIUM_PRICE_ID!
  }
} as const

// Re-export for backward compatibility
export { PLANS, type PlanId }