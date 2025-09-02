import { supabase, supabaseAdmin } from './client'
import { auth, getUserProfile } from './auth'

export type UserPlan = 'free' | 'basic' | 'premium'
export type SubscriptionStatus = 'active' | 'inactive' | 'past_due' | 'canceled' | 'trialing'

export interface UserProfile {
  id: string
  email: string
  name: string | null
  plan: UserPlan
  stripe_customer_id: string | null
  subscription_status: SubscriptionStatus | null
  subscription_id: string | null
  created_at: string
  updated_at: string
}

// Get user by ID (admin function)
export async function getUserById(userId: string): Promise<UserProfile | null> {
  "use server";
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // User not found
      }
      throw error
    }

    return data
  } catch (error) {
    console.error('getUserById error:', error)
    return null
  }
}

// Get user by email (admin function)
export async function getUserByEmail(email: string): Promise<UserProfile | null> {
  "use server";
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // User not found
      }
      throw error
    }

    return data
  } catch (error) {
    console.error('getUserByEmail error:', error)
    return null
  }
}

// Get user by Stripe customer ID (admin function)
export async function getUserByStripeCustomerId(customerId: string): Promise<UserProfile | null> {
  "use server";
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('stripe_customer_id', customerId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // User not found
      }
      throw error
    }

    return data
  } catch (error) {
    console.error('getUserByStripeCustomerId error:', error)
    return null
  }
}

// Create user profile (called by trigger, but can be used manually)
export async function createUserProfile(
  userId: string,
  email: string,
  name?: string
): Promise<UserProfile> {
  "use server";
  try {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        id: userId,
        email,
        name: name || email.split('@')[0],
        plan: 'free'
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('createUserProfile error:', error)
    throw new Error(`Failed to create user profile: ${error}`)
  }
}

// Update user plan
export async function updateUserPlan(
  userId: string,
  plan: UserPlan,
  stripeCustomerId?: string,
  subscriptionId?: string,
  subscriptionStatus?: SubscriptionStatus
): Promise<UserProfile> {
  "use server";
  try {
    const updates: any = { plan }
    
    if (stripeCustomerId) updates.stripe_customer_id = stripeCustomerId
    if (subscriptionId) updates.subscription_id = subscriptionId
    if (subscriptionStatus) updates.subscription_status = subscriptionStatus

    const { data, error } = await supabaseAdmin
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('updateUserPlan error:', error)
    throw new Error(`Failed to update user plan: ${error}`)
  }
}

// Get current user's plan info
export async function getCurrentUserPlan() {
  "use server";
  try {
    const { userId } = await auth()
    if (!userId) {
      throw new Error("User not authenticated")
    }

    const profile = await getUserProfile(userId)
    if (!profile) {
      throw new Error("User profile not found")
    }

    return {
      plan: profile.plan,
      planName: getPlanDisplayName(profile.plan),
      subscriptionStatus: profile.subscription_status,
      subscriptionId: profile.subscription_id,
      stripeCustomerId: profile.stripe_customer_id
    }
  } catch (error) {
    console.error('getCurrentUserPlan error:', error)
    throw error
  }
}

// Get plan display name
export function getPlanDisplayName(plan: UserPlan): string {
  switch (plan) {
    case 'premium':
      return 'プレミアムプラン'
    case 'basic':
      return 'ベーシックプラン'
    case 'free':
    default:
      return 'フリープラン'
  }
}

// Get plan limits
export function getPlanLimits(plan: UserPlan) {
  switch (plan) {
    case 'premium':
      return {
        interviewLimit: 999,
        esLimit: 999,
        displayName: 'プレミアムプラン'
      }
    case 'basic':
      return {
        interviewLimit: 20,
        esLimit: 20,
        displayName: 'ベーシックプラン'
      }
    case 'free':
    default:
      return {
        interviewLimit: 1,
        esLimit: 5,
        displayName: 'フリープラン'
      }
  }
}

// Check if user can perform action based on plan
export async function canUserPerformAction(
  action: 'interview' | 'es_correction',
  userId?: string
): Promise<{ canPerform: boolean; reason?: string }> {
  "use server";
  try {
    const currentUserId = userId || (await auth()).userId
    if (!currentUserId) {
      return { canPerform: false, reason: 'User not authenticated' }
    }

    const profile = await getUserProfile(currentUserId)
    if (!profile) {
      return { canPerform: false, reason: 'User profile not found' }
    }

    const limits = getPlanLimits(profile.plan)
    
    // For now, just check plan limits. 
    // Usage checking will be handled in the usage.actions.ts file
    if (action === 'interview' && limits.interviewLimit === 0) {
      return { canPerform: false, reason: 'No interview access on current plan' }
    }
    
    if (action === 'es_correction' && limits.esLimit === 0) {
      return { canPerform: false, reason: 'No ES correction access on current plan' }
    }

    return { canPerform: true }
  } catch (error) {
    console.error('canUserPerformAction error:', error)
    return { canPerform: false, reason: 'Error checking permissions' }
  }
}

// Admin function to get all users (for admin purposes)
export async function getAllUsers(
  page: number = 1,
  limit: number = 50
): Promise<{ users: UserProfile[]; total: number; hasMore: boolean }> {
  "use server";
  try {
    const offset = (page - 1) * limit

    const [usersResult, countResult] = await Promise.all([
      supabaseAdmin
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1),
      supabaseAdmin
        .from('users')
        .select('*', { count: 'exact', head: true })
    ])

    if (usersResult.error) throw usersResult.error
    if (countResult.error) throw countResult.error

    const total = countResult.count || 0
    const hasMore = offset + limit < total

    return {
      users: usersResult.data || [],
      total,
      hasMore
    }
  } catch (error) {
    console.error('getAllUsers error:', error)
    throw new Error(`Failed to fetch users: ${error}`)
  }
}