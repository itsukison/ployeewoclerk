"use server";

import { auth } from "@/lib/supabase/auth";
import { supabaseAdmin } from "@/lib/supabase/client";

export interface ESCorrection {
  id: string;
  user_id: string;
  company_name: string;
  question: string;
  answer: string;
  ai_feedback?: string;
  overall_score?: number;
  match_score?: number;
  structure_score?: number;
  basic_score?: number;
  scores?: any;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface ESCorrectionResult {
  corrections: ESCorrection[];
  total: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Get ES corrections for the current user with pagination
 */
export async function getUserESCorrections(
  page: number = 1,
  limit: number = 12,
  sortBy: string = "newest"
): Promise<ESCorrectionResult> {
  try {
    const { userId } = await auth();
    
    // Return empty result if not authenticated
    if (!userId) {
      return {
        corrections: [],
        total: 0,
        currentPage: page,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };
    }

    const offset = (page - 1) * limit;
    
    // Determine sort order
    let orderBy = "created_at";
    let ascending = false;
    
    switch (sortBy) {
      case "oldest":
        orderBy = "created_at";
        ascending = true;
        break;
      case "score_high":
        orderBy = "overall_score";
        ascending = false;
        break;
      case "score_low":
        orderBy = "overall_score";
        ascending = true;
        break;
      case "company":
        orderBy = "company_name";
        ascending = true;
        break;
      default: // newest
        orderBy = "created_at";
        ascending = false;
    }

    // Get total count
    const { count, error: countError } = await supabaseAdmin
      .from("es_corrections")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (countError) {
      console.error("Count error:", countError);
      throw new Error("Failed to get corrections count");
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    // Get corrections with pagination
    const { data: corrections, error } = await supabaseAdmin
      .from("es_corrections")
      .select("*")
      .eq("user_id", userId)
      .order(orderBy, { ascending })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("ES corrections fetch error:", error);
      throw new Error("Failed to fetch ES corrections");
    }

    return {
      corrections: corrections || [],
      total,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  } catch (error) {
    console.error("getUserESCorrections error:", error);
    throw error;
  }
}

/**
 * Get all ES corrections (admin function)
 */
export async function getAllESCorrections(
  page: number = 1,
  limit: number = 12,
  filter: string = "all",
  sortBy: string = "newest"
): Promise<ESCorrectionResult> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const offset = (page - 1) * limit;
    
    // Build query
    let query = supabaseAdmin.from("es_corrections").select("*", { count: "exact" });
    
    // Apply filters
    if (filter !== "all") {
      switch (filter) {
        case "completed":
          query = query.eq("status", "completed");
          break;
        case "processing":
          query = query.eq("status", "processing");
          break;
        case "failed":
          query = query.eq("status", "failed");
          break;
        case "high_score":
          query = query.gte("overall_score", 90);
          break;
        case "low_score":
          query = query.lt("overall_score", 70);
          break;
      }
    }

    // Get total count
    const { count, error: countError } = await query;

    if (countError) {
      console.error("Count error:", countError);
      throw new Error("Failed to get corrections count");
    }

    const total = count || 0;
    const totalPages = Math.ceil(total / limit);

    // Determine sort order
    let orderBy = "created_at";
    let ascending = false;
    
    switch (sortBy) {
      case "oldest":
        orderBy = "created_at";
        ascending = true;
        break;
      case "score_high":
        orderBy = "overall_score";
        ascending = false;
        break;
      case "score_low":
        orderBy = "overall_score";
        ascending = true;
        break;
      case "company":
        orderBy = "company_name";
        ascending = true;
        break;
      default: // newest
        orderBy = "created_at";
        ascending = false;
    }

    // Reset query for data fetch
    query = supabaseAdmin.from("es_corrections").select("*");
    
    // Apply same filters
    if (filter !== "all") {
      switch (filter) {
        case "completed":
          query = query.eq("status", "completed");
          break;
        case "processing":
          query = query.eq("status", "processing");
          break;
        case "failed":
          query = query.eq("status", "failed");
          break;
        case "high_score":
          query = query.gte("overall_score", 90);
          break;
        case "low_score":
          query = query.lt("overall_score", 70);
          break;
      }
    }

    // Get corrections with pagination and sorting
    const { data: corrections, error } = await query
      .order(orderBy, { ascending })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("ES corrections fetch error:", error);
      throw new Error("Failed to fetch ES corrections");
    }

    return {
      corrections: corrections || [],
      total,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  } catch (error) {
    console.error("getAllESCorrections error:", error);
    throw error;
  }
}

/**
 * Get a single ES correction by ID
 */
export async function getESCorrectionById(id: string): Promise<ESCorrection | null> {
  try {
    const { userId } = await auth();
    
    // Return null if not authenticated
    if (!userId) {
      return null;
    }

    const { data: correction, error } = await supabaseAdmin
      .from("es_corrections")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("ES correction fetch error:", error);
      return null;
    }

    return correction;
  } catch (error) {
    console.error("getESCorrectionById error:", error);
    return null;
  }
}

/**
 * Create a new ES correction
 */
export async function createESCorrection(data: {
  company_name: string;
  question: string;
  answer: string;
}): Promise<ESCorrection> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const { data: correction, error } = await supabaseAdmin
      .from("es_corrections")
      .insert({
        user_id: userId,
        company_name: data.company_name,
        question: data.question,
        answer: data.answer,
        status: "pending"
      })
      .select()
      .single();

    if (error) {
      console.error("ES correction creation error:", error);
      throw new Error("Failed to create ES correction");
    }

    return correction;
  } catch (error) {
    console.error("createESCorrection error:", error);
    throw error;
  }
}

/**
 * Update ES correction with AI feedback and scores
 */
export async function updateESCorrectionWithFeedback(
  id: string,
  feedback: {
    ai_feedback: string;
    overall_score: number;
    match_score: number;
    structure_score: number;
    basic_score: number;
  }
): Promise<ESCorrection> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const { data: correction, error } = await supabaseAdmin
      .from("es_corrections")
      .update({
        ai_feedback: feedback.ai_feedback,
        overall_score: feedback.overall_score,
        match_score: feedback.match_score,
        structure_score: feedback.structure_score,
        basic_score: feedback.basic_score,
        scores: {
          overall: feedback.overall_score,
          match: feedback.match_score,
          structure: feedback.structure_score,
          basic: feedback.basic_score
        },
        status: "completed"
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("ES correction update error:", error);
      throw new Error("Failed to update ES correction");
    }

    return correction;
  } catch (error) {
    console.error("updateESCorrectionWithFeedback error:", error);
    throw error;
  }
}

/**
 * Delete an ES correction
 */
export async function deleteESCorrection(id: string): Promise<boolean> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const { error } = await supabaseAdmin
      .from("es_corrections")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("ES correction deletion error:", error);
      throw new Error("Failed to delete ES correction");
    }

    return true;
  } catch (error) {
    console.error("deleteESCorrection error:", error);
    throw error;
  }
}

/**
 * Get ES correction statistics for a user
 */
export async function getESCorrectionStats(userId?: string): Promise<{
  total: number;
  completed: number;
  processing: number;
  failed: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
}> {
  try {
    const { userId: currentUserId } = await auth();
    const targetUserId = userId || currentUserId;
    
    // Return default stats if not authenticated
    if (!targetUserId) {
      return {
        total: 0,
        completed: 0,
        processing: 0,
        failed: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
      };
    }

    // Get all corrections for the user
    const { data: corrections, error } = await supabaseAdmin
      .from("es_corrections")
      .select("overall_score, status")
      .eq("user_id", targetUserId);

    if (error) {
      console.error("ES correction stats error:", error);
      throw new Error("Failed to get ES correction statistics");
    }

    const total = corrections.length;
    const completed = corrections.filter(c => c.status === "completed").length;
    const processing = corrections.filter(c => c.status === "processing").length;
    const failed = corrections.filter(c => c.status === "failed").length;

    const completedCorrections = corrections.filter(c => c.status === "completed" && c.overall_score);
    const scores = completedCorrections.map(c => c.overall_score).filter(Boolean);
    
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
    const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;

    return {
      total,
      completed,
      processing,
      failed,
      averageScore,
      highestScore,
      lowestScore
    };
  } catch (error) {
    console.error("getESCorrectionStats error:", error);
    throw error;
  }
}