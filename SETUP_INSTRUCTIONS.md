# Migration Setup: Clerk → Supabase + Stripe Integration

This guide will help you migrate from Clerk authentication to Supabase authentication and integrate Stripe for payments and subscriptions.

## 📋 Prerequisites

- Supabase account and project
- Stripe account
- Google Cloud Console project (for Google OAuth)

---

## 🔧 1. Supabase Setup

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and anon key
3. Go to Settings → API to find your service role key

### 1.2 Database Setup

Run the SQL schema in your Supabase SQL editor (found in `supabase/schema.sql`):

```bash
# The schema will create:
# - users table (extends auth.users)
# - RLS policies for security
# - Updated usage_tracking table
```

### 1.3 Authentication Providers

1. Go to Authentication → Providers in your Supabase dashboard
2. Enable Google provider:
   - Add your Google OAuth client ID and secret
   - Set redirect URL to: `https://yourproject.supabase.co/auth/v1/callback`

---

## 💳 2. Stripe Setup

### 2.1 Create Stripe Products and Prices

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Create products for your plans:

**Basic Plan (ベーシックプラン)**
- Product name: "Basic Plan"
- Price: ¥500/month (or your preferred amount)
- Billing: Recurring monthly

**Premium Plan (プレミアムプラン)**  
- Product name: "Premium Plan"
- Price: ¥2000/month (or your preferred amount)
- Billing: Recurring monthly

3. Note down the price IDs for each plan

### 2.2 Configure Webhooks

1. Go to Developers → Webhooks in Stripe dashboard
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select these events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

4. Note down the webhook signing secret

---

## 🔐 3. Environment Variables

Update your `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs
STRIPE_BASIC_PRICE_ID=price_...
STRIPE_PREMIUM_PRICE_ID=price_...

# Keep existing variables
GOOGLE_API_KEY=your-google-api-key
GOOGLE_APPLICATION_CREDENTIALS_JSON=your-credentials-json
RESEND_API_KEY=your-resend-key
```

---

## 📦 4. Install Dependencies

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs @stripe/stripe-js stripe
```

---

## 🔄 5. Migration Steps

### Step 1: Database Setup
```bash
# Run the SQL schema in Supabase SQL editor
# File: supabase/schema.sql
```

### Step 2: Update Authentication
The migration includes:
- New Supabase auth utilities (`lib/supabase/auth.ts`)
- User management functions (`lib/supabase/users.ts`)
- Updated usage tracking (`lib/actions/usage.actions.ts`)

### Step 3: Stripe Integration
- Payment processing (`lib/stripe/config.ts`)
- Subscription management
- Webhook handlers (`app/api/webhooks/stripe/route.ts`)

### Step 4: Update Components
- Replace Clerk components with Supabase auth
- Update dashboard to use new auth system
- Add Stripe checkout integration

---

## 🧪 6. Testing

### Test Authentication
1. Sign up with email/password
2. Sign in with Google OAuth
3. Verify user profile creation

### Test Payments
1. Subscribe to Basic plan
2. Subscribe to Premium plan  
3. Cancel subscription
4. Verify webhook handling

### Test Usage Tracking
1. Start interview session
2. Generate ES correction
3. Verify usage counts update correctly

---

## 🚀 7. Deployment Checklist

- [ ] Environment variables set in production
- [ ] Supabase RLS policies enabled
- [ ] Stripe webhooks configured for production
- [ ] Google OAuth configured for production domain
- [ ] Database schema applied
- [ ] All auth flows tested

---

## 🔍 8. Troubleshooting

### Common Issues

**Authentication not working:**
- Check Supabase URL and keys
- Verify RLS policies are set up correctly
- Check browser console for errors

**Stripe payments failing:**
- Verify webhook endpoint is accessible
- Check Stripe price IDs are correct
- Ensure webhook secret is properly set

**Usage tracking not updating:**
- Check database permissions
- Verify user ID is being passed correctly
- Check API route responses

---

## 📚 9. Key Files Created/Modified

```
/lib/supabase/
├── auth.ts              # Authentication utilities
├── users.ts             # User management
└── client.ts            # Supabase client

/lib/stripe/
├── config.ts            # Stripe configuration
└── utils.ts             # Payment utilities

/app/api/webhooks/
└── stripe/
    └── route.ts         # Stripe webhook handler

/components/auth/
├── AuthProvider.tsx     # Auth context provider
├── SignInForm.tsx       # Sign in form
├── SignUpForm.tsx       # Sign up form
└── ProfileMenu.tsx      # User profile menu

/supabase/
└── schema.sql           # Database schema

Modified files:
- lib/actions/usage.actions.ts
- app/dashboard/page.tsx
- components/ui/Header.tsx
```

This setup provides a robust foundation for user authentication with Supabase and payment processing with Stripe while maintaining your existing usage tracking functionality.