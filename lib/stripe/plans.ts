// Client-safe plan configuration (no server-side env vars)
export const PLANS = {
  free: {
    name: 'フリープラン',
    price: 0,
    currency: 'jpy',
    interval: null,
    features: {
      interviews: 1,
      esCorrections: 5,
      support: 'basic'
    }
  },
  basic: {
    name: 'ベーシックプラン',
    price: 500,
    currency: 'jpy',
    interval: 'month',
    features: {
      interviews: 20,
      esCorrections: 20,
      support: 'priority'
    }
  },
  premium: {
    name: 'プレミアムプラン',
    price: 2000,
    currency: 'jpy',
    interval: 'month',
    features: {
      interviews: 999,
      esCorrections: 999,
      support: '24/7'
    }
  }
} as const

export type PlanId = keyof typeof PLANS