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
    price: 300,
    currency: 'jpy',
    interval: 'month',
    features: {
      interviews: 10,
      esCorrections: 20,
      support: 'priority'
    }
  },
  premium: {
    name: 'プレミアムプラン',
    price: 750,
    currency: 'jpy',
    interval: 'month',
    features: {
      interviews: 30,
      esCorrections: 50,
      support: '24/7'
    }
  }
} as const

export type PlanId = keyof typeof PLANS