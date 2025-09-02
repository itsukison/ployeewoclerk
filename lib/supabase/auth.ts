import 'server-only';
import { cookies } from 'next/headers';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { supabaseAdmin } from './client';

/**
 * Request-scoped Supabase client that reads/writes Next.js cookies.
 * Safe to call in RSC, server components, route handlers, and actions.
 */
export async function createClient() {
  const cookieStore = await cookies();
  
  // Debug: Log available cookies for authentication debugging
  const allCookies = cookieStore.getAll();
  const authCookies = allCookies.filter(cookie => 
    cookie.name.includes('supabase') || 
    cookie.name.includes('auth') ||
    cookie.name.includes('session')
  );
  
  if (authCookies.length === 0) {
    console.warn('No authentication cookies found');
  } else {
    console.log('Found', authCookies.length, 'auth cookies');
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const value = cookieStore.get(name)?.value;
          if (name.includes('supabase') && !value) {
            console.warn(`Missing auth cookie: ${name}`);
          }
          return value;
        },
        // In RSC, write attempts can throw – so guard them.
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
            console.log(`Set cookie ${name}`);
          } catch (err) {
            console.warn(`Failed to set cookie ${name}:`, err);
            // no-op in RSC
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 });
            console.log(`Removed cookie ${name}`);
          } catch (err) {
            console.warn(`Failed to remove cookie ${name}:`, err);
            // no-op in RSC
          }
        },
      },
    }
  );
}

/** Minimal auth helper used by your usage functions */
export async function auth() {
  try {
    const supabase = await createClient();
    
    // First try to get the session (includes both user and session info)
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return { userId: null, user: null, error: sessionError };
    }
    
    if (!session) {
      // No session found, but this is not necessarily an error
      console.log('No session found - user not authenticated');
      return { userId: null, user: null, error: new Error('Auth session missing!') };
    }
    
    const user = session.user;
    console.log('Auth successful - User ID:', user?.id);
    
    return { userId: user?.id ?? null, user, error: null };
  } catch (err) {
    console.error('Auth function exception:', err);
    return { 
      userId: null, 
      user: null, 
      error: err instanceof Error ? err : new Error('Unknown auth error')
    };
  }
}

// Get user profile with plan information
export async function getUserProfile(userId?: string) {
  const supabase = await createClient()
  
  try {
    let currentUserId = userId
    if (!currentUserId) {
      const { userId: authUserId } = await auth()
      if (!authUserId) {
        throw new Error("User not authenticated")
      }
      currentUserId = authUserId
    }

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', currentUserId)
      .single()

    if (error) {
      console.error('Profile fetch error:', error)
      throw new Error(`Failed to fetch user profile: ${error.message}`)
    }

    return profile
  } catch (error) {
    console.error('getUserProfile error:', error)
    throw error
  }
}

// Check user plan features - replacement for Clerk's has() function
export async function hasFeature(feature: string, userId?: string) {
  try {
    const profile = await getUserProfile(userId)
    
    if (!profile) {
      return false
    }

    const plan = profile.plan
    
    // Map features to plan capabilities
    switch (feature) {
      // Interview features
      case 'interview_20':
        return plan === 'premium'
      case 'interview_10':
        return plan === 'basic' || plan === 'premium'
      case 'interview_1':
        return true // All plans have at least 1 interview
      
      // ES correction features
      case 'es_50':
        return plan === 'premium'
      case 'es_20':
        return plan === 'basic' || plan === 'premium'
      case 'es_5':
        return true // All plans have at least 5 ES corrections
      
      default:
        return false
    }
  } catch (error) {
    console.error('hasFeature error:', error)
    return false
  }
}

// Get user plan limits using database function
export async function getUserPlanLimits(userId?: string) {
  try {
    let currentUserId = userId
    if (!currentUserId) {
      const { userId: authUserId } = await auth()
      if (!authUserId) {
        throw new Error("User not authenticated")
      }
      currentUserId = authUserId
    }

    const { data, error } = await supabaseAdmin.rpc('get_user_plan_limits', {
      user_id: currentUserId
    })

    if (error) {
      console.error('Plan limits fetch error:', error)
      throw new Error(`Failed to fetch plan limits: ${error.message}`)
    }

    if (!data || data.length === 0) {
      // Default to free plan limits
      return {
        interview_limit: 1,
        es_limit: 5,
        plan_name: 'フリープラン'
      }
    }

    return data[0]
  } catch (error) {
    console.error('getUserPlanLimits error:', error)
    // Return safe defaults on error
    return {
      interview_limit: 1,
      es_limit: 5,
      plan_name: 'フリープラン'
    }
  }
}

// Update user profile
export async function updateUserProfile(updates: {
  name?: string
  plan?: 'free' | 'basic' | 'premium'
  stripe_customer_id?: string
  subscription_status?: 'active' | 'inactive' | 'past_due' | 'canceled' | 'trialing'
  subscription_id?: string
}, userId?: string) {
  const supabase = await createClient()
  
  try {
    let currentUserId = userId
    if (!currentUserId) {
      const { userId: authUserId } = await auth()
      if (!authUserId) {
        throw new Error("User not authenticated")
      }
      currentUserId = authUserId
    }

    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', currentUserId)
      .select()
      .single()

    if (error) {
      console.error('Profile update error:', error)
      throw new Error(`Failed to update profile: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('updateUserProfile error:', error)
    throw error
  }
}

// Sign out user
export async function signOut() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Sign out error:', error)
    throw new Error(`Failed to sign out: ${error.message}`)
  }
}

// Admin function to update user subscription (used by webhooks)
export async function updateUserSubscription(
  stripeCustomerId: string,
  subscriptionId?: string,
  status?: 'active' | 'inactive' | 'past_due' | 'canceled' | 'trialing',
  planName?: string
) {
  try {
    const { data, error } = await supabaseAdmin.rpc('update_user_subscription', {
      customer_id: stripeCustomerId,
      subscription_id: subscriptionId,
      status,
      plan_name: planName
    })

    if (error) {
      console.error('Subscription update error:', error)
      throw new Error(`Failed to update subscription: ${error.message}`)
    }

    return data
  } catch (error) {
    console.error('updateUserSubscription error:', error)
    throw error
  }
}