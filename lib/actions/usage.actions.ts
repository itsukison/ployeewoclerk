"use server";

import { auth, getUserPlanLimits, hasFeature, createClient } from "../supabase/auth";

/** First day of current month: 'YYYY-MM-01' */
function monthStart() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}


/** READ: current interview usage this month – returns 0 if not signed in */
export async function getCurrentUsage(): Promise<number> {
  const { userId } = await auth();
  if (!userId) return 0; // FIX: no throw while rendering signed-out pages

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('usage_tracking')
    .select('minutes_used')
    .eq('author', userId)
    .eq('month_year', monthStart())
    .single();

  if (error?.code === 'PGRST116') {
    // No record found, create one with 0 usage
    const { data: inserted, error: insertError } = await supabase
      .from('usage_tracking')
      .insert({ author: userId, user_id: userId, minutes_used: 0, action: 'interview' })
      .select('minutes_used')
      .single();
    if (insertError) throw new Error(`Failed to create usage record: ${insertError.message}`);
    return inserted?.minutes_used ?? 0;
  }
  if (error) throw new Error(`Failed to fetch usage: ${error.message}`);
  return data?.minutes_used ?? 0;
}

/**
 * Add completed interview to user's monthly usage count
 * Uses atomic UPSERT operation to prevent race conditions
 * @deprecated Use trackInterviewSessionStart() instead for session-based tracking
 */
export async function addInterviewUsage(): Promise<void> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const supabase = await createClient();

  // First, try to get existing record
  const { data: existingData, error: fetchError } = await supabase
    .from('usage_tracking')
    .select('minutes_used')
    .eq('author', userId)
    .eq('month_year', monthStart())
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error checking current usage:', fetchError);
    throw new Error(`Failed to check current usage: ${fetchError.message}`);
  }

  if (existingData) {
    // Record exists, increment it
    const newCount = existingData.minutes_used + 1;
    const { error: updateError } = await supabase
      .from('usage_tracking')
      .update({ minutes_used: newCount })
      .eq('author', userId)
      .eq('month_year', monthStart());

    if (updateError) {
      console.error('Error updating usage:', updateError);
      throw new Error(`Failed to update usage: ${updateError.message}`);
    }

    console.log(`Updated interview usage. Total for ${monthStart()}: ${newCount} interviews`);
  } else {
    // Record doesn't exist, create it with 1
    const { error: insertError } = await supabase
      .from('usage_tracking')
      .insert({
        author: userId,
        user_id: userId,
        minutes_used: 1,
        action: 'interview',
      });

    if (insertError) {
      console.error('Error creating new usage record:', insertError);
      throw new Error(`Failed to create new usage record: ${insertError.message}`);
    }

    console.log(`Created new interview usage record. Total for ${monthStart()}: 1 interview`);
  }
}

/**
 * Track interview session start - adds to usage count when session begins
 * This is called when a user starts a new interview session
 */
export async function trackInterviewSessionStart(): Promise<void> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const supabase = await createClient();

  // Use atomic upsert with proper increment logic
  const { data: existingData, error: fetchError } = await supabase
    .from('usage_tracking')
    .select('minutes_used')
    .eq('author', userId)
    .eq('month_year', monthStart())
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error checking current usage:', fetchError);
    throw new Error(`Failed to check current usage: ${fetchError.message}`);
  }

  if (existingData) {
    // Record exists, increment it
    const newCount = existingData.minutes_used + 1;
    
    const { error: updateError } = await supabase
      .from('usage_tracking')
      .update({ minutes_used: newCount })
      .eq('author', userId)
      .eq('month_year', monthStart());

    if (updateError) {
      console.error('Error updating usage:', updateError);
      throw new Error(`Failed to update usage: ${updateError.message}`);
    }

    console.log(`Updated existing interview usage. Total for ${monthStart()}: ${newCount} interviews`);
  } else {
    // Record doesn't exist, create it with 1
    const { error: insertError } = await supabase
      .from('usage_tracking')
      .insert({
        author: userId,
        user_id: userId,
        minutes_used: 1,
        action: 'interview',
      });

    if (insertError) {
      console.error('Error creating new usage record:', insertError);
      throw new Error(`Failed to create new usage record: ${insertError.message}`);
    }

    console.log(`Created new interview usage record. Total for ${monthStart()}: 1 interview`);
  }
}

/**
 * Get user's interview plan limit based on Supabase user plan
 * @returns number of interviews allowed per month
 */
export async function getUserPlanLimit(): Promise<number> {
  try {
    const { userId } = await auth();
    if (!userId) return 1; // Return default for unauthenticated users
    
    const limits = await getUserPlanLimits();
    return limits.interview_limit;
  } catch (error) {
    console.error('Error getting user plan limit:', error);
    // Default to free plan on error
    console.warn('Defaulting to 1 interview due to error checking plan');
    return 1;
  }
}

/**
 * Get user's ES correction plan limit based on Supabase user plan
 * @returns number of ES corrections allowed per month
 */
export async function getESPlanLimit(): Promise<number> {
  try {
    const { userId } = await auth();
    if (!userId) return 5; // Return default for unauthenticated users
    
    const limits = await getUserPlanLimits();
    return limits.es_limit;
  } catch (error) {
    console.error('Error getting user ES plan limit:', error);
    // Default to free plan on error
    console.warn('Defaulting to 5 ES corrections due to error checking plan');
    return 5;
  }
}

/** READ: current ES usage this month – returns 0 if not signed in */
export async function getCurrentESUsage(): Promise<number> {
  const { userId } = await auth();
  if (!userId) return 0; // FIX: no throw during RSC stream

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('usage_tracking')
    .select('es_corrections_used')
    .eq('author', userId)
    .eq('month_year', monthStart())
    .single();

  if (error?.code === 'PGRST116') {
    // No record found, create one with 0 usage
    const { data: inserted, error: insertError } = await supabase
      .from('usage_tracking')
      .insert({ author: userId, user_id: userId, minutes_used: 0, es_corrections_used: 0, action: 'es_correction' })
      .select('es_corrections_used')
      .single();
    if (insertError) throw new Error(`Failed to create ES usage record: ${insertError.message}`);
    return inserted?.es_corrections_used ?? 0;
  }
  if (error) throw new Error(`Failed to fetch ES usage: ${error.message}`);
  return data?.es_corrections_used ?? 0;
}

/**
 * Get user's plan name based on Supabase user plan
 * @returns string representing the plan name
 */
export async function getUserPlanName(): Promise<string> {
  try {
    const { userId } = await auth();
    if (!userId) return 'フリープラン'; // Return default for unauthenticated users
    
    const limits = await getUserPlanLimits();
    return limits.plan_name;
  } catch (error) {
    console.error('Error getting user plan name:', error);
    return 'フリープラン'; // Default to free plan
  }
}

/**
 * Track ES correction usage - adds to usage count when ES correction is created
 * This is called when a user starts a new ES correction
 */
export async function trackESUsage(): Promise<void> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const supabase = await createClient();

  // First, try to get existing record
  const { data: existingData, error: fetchError } = await supabase
    .from('usage_tracking')
    .select('es_corrections_used, minutes_used')
    .eq('author', userId)
    .eq('month_year', monthStart())
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error checking current ES usage:', fetchError);
    throw new Error(`Failed to check current ES usage: ${fetchError.message}`);
  }

  if (existingData) {
    // Record exists, increment ES usage
    const newCount = (existingData.es_corrections_used || 0) + 1;
    const { error: updateError } = await supabase
      .from('usage_tracking')
      .update({ es_corrections_used: newCount })
      .eq('author', userId)
      .eq('month_year', monthStart());

    if (updateError) {
      console.error('Error updating ES usage:', updateError);
      throw new Error(`Failed to update ES usage: ${updateError.message}`);
    }

    console.log(`Updated ES usage. Total for ${monthStart()}: ${newCount} ES corrections`);
  } else {
    // Record doesn't exist, create it with 1 ES usage
    const { error: insertError } = await supabase
      .from('usage_tracking')
      .insert({
        author: userId,
        user_id: userId,
        minutes_used: 0,
        es_corrections_used: 1,
        action: 'es_correction',
      });

    if (insertError) {
      console.error('Error creating new ES usage record:', insertError);
      throw new Error(`Failed to create new ES usage record: ${insertError.message}`);
    }

    console.log(`Created new ES usage record. Total for ${monthStart()}: 1 ES correction`);
  }
}

/**
 * Check if user can start a new ES correction (pre-correction check)
 * @returns object with canStart boolean and current usage info
 */
export async function canStartESCorrection(): Promise<{
  canStart: boolean;
  currentUsage: number;
  planLimit: number;
  remainingCorrections: number;
}> {
  try {
    const currentUsage = await getCurrentESUsage();
    const planLimit = await getESPlanLimit();
    const remainingCorrections = Math.max(0, planLimit - currentUsage);
    // User can start if they have corrections remaining
    const canStart = remainingCorrections > 0;
    
    return {
      canStart,
      currentUsage,
      planLimit,
      remainingCorrections
    };
  } catch (error) {
    console.error('Error in canStartESCorrection:', error);
    // Instead of throwing, return safe defaults that allow access
    return {
      canStart: true,
      currentUsage: 0,
      planLimit: 5,
      remainingCorrections: 5
    };
  }
}

/**
 * Check if user can start a new session (pre-session check)
 * @returns object with canStart boolean and current usage info
 */
export async function canStartSession(): Promise<{
  canStart: boolean;
  currentUsage: number;
  planLimit: number;
  remainingInterviews: number;
}> {
  try {
    const currentUsage = await getCurrentUsage();
    const planLimit = await getUserPlanLimit();
    const remainingInterviews = Math.max(0, planLimit - currentUsage);
    // User can start if they have interviews remaining
    const canStart = remainingInterviews > 0;
    
    return {
      canStart,
      currentUsage,
      planLimit,
      remainingInterviews
    };
  } catch (error) {
    console.error('Error in canStartSession:', error);
    // Instead of throwing, return safe defaults that allow access
    return {
      canStart: true,
      currentUsage: 0,
      planLimit: 1,
      remainingInterviews: 1
    };
  }
}