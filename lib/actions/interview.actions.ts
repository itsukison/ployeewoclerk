"use server"

import { auth, createClient } from "@/lib/supabase/auth"
import { trackInterviewSessionStart } from "./usage.actions"
import { calculateSessionMinutes } from "../utils"

// Helper function to verify authentication status
export const verifyAuth = async (): Promise<{ isAuthenticated: boolean; userId?: string; error?: string }> => {
    try {
        const { userId, user, error } = await auth();
        console.log("verifyAuth - userId:", userId, "error:", error?.message);
        
        if (error) {
            console.error("Auth verification error:", error);
            return {
                isAuthenticated: false,
                error: error.message
            };
        }
        
        return {
            isAuthenticated: !!userId,
            userId: userId || undefined
        };
    } catch (err) {
        console.error("verifyAuth exception:", err);
        return {
            isAuthenticated: false,
            error: err instanceof Error ? err.message : 'Unknown error'
        };
    }
};

// Type definition based on the form schema
type CreateInterview = {
  name: string;
  education: string;
  companyName: string;
  interviewFocus: "consulting" | "finance" | "manufacturing" | "trading" | "it" | "advertising" | "hr" | "infrastructure" | "real_estate";
}

// Return type for createInterview
type CreateInterviewResult = 
  | { ok: true; interview: any }
  | { ok: false; code: "UNAUTHENTICATED" | "DB_ERROR" | "USAGE_LIMIT_EXCEEDED"; message?: string }

export const createInterview = async (formData: CreateInterview): Promise<CreateInterviewResult> => {
    let authResult = await auth();
    
    // If no user found, try to get a fresh session one more time
    if (!authResult.userId) {
        console.log("Initial auth failed, attempting to get fresh session...");
        authResult = await auth();
    }
    
    // Return error object instead of throwing
    if (!authResult.userId) {
        console.error("Authentication failed in createInterview:", authResult.error?.message);
        return { ok: false, code: "UNAUTHENTICATED" as const };
    }
    
    const supabase = await createClient();
    
    const {data, error} = await supabase
        .from("interviews")
        .insert({
            ...formData,
            author: authResult.userId
        })
        .select();

    if (error) {
        console.error("Supabase error:", error)
        return { ok: false, code: "DB_ERROR" as const, message: error.message };
    }
    
    if (!data || data.length === 0) {
        return { ok: false, code: "DB_ERROR" as const, message: "No data returned from database" };
    }

    console.log("Interview created successfully:", data[0].id);
    return { ok: true, interview: data[0] };
}

export const getUserInterviews = async (page: number = 1, limit: number = 9) => {
    const {userId: author} = await auth()
    
    // Return empty result if not authenticated
    if (!author) {
        return {
            interviews: [],
            totalCount: 0,
            currentPage: page,
            totalPages: 0
        };
    }
    
    const supabase = await createClient()
    const offset = (page - 1) * limit;
    
    const {data, error, count} = await supabase
        .from("interviews")
        .select("*", { count: 'exact' })
        .eq("author", author)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

    if (error) {
        console.error("Supabase error:", error)
        throw new Error(`Database error: ${error.message}`)
    }

    return {
        interviews: data || [],
        totalCount: count || 0,
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit)
    };
}

export const getAllInterviews = async (
    page: number = 1, 
    limit: number = 12, 
    filter?: string, 
    sortBy: string = 'newest'
) => {
    const supabase = await createClient()
    const offset = (page - 1) * limit;
    
    let query = supabase
        .from("interviews")
        .select("*", { count: 'exact' });
    
    // Apply filter
    if (filter && filter !== 'all') {
        query = query.eq('interviewFocus', filter);
    }
    
    // Apply sorting
    switch (sortBy) {
        case 'oldest':
            query = query.order("created_at", { ascending: true });
            break;
        case 'popularity':
            // For now, we'll use creation date as a proxy for popularity
            // In the future, you could add a views or interactions column
            query = query.order("created_at", { ascending: false });
            break;
        case 'newest':
        default:
            query = query.order("created_at", { ascending: false });
            break;
    }
    
    query = query.range(offset, offset + limit - 1);

    const {data, error, count} = await query;

    if (error) {
        console.error("Supabase error:", error)
        throw new Error(`Database error: ${error.message}`)
    }

    return {
        interviews: data || [],
        total: count || 0,
        currentPage: page,
        totalPages: Math.ceil((count || 0) / limit),
        hasNextPage: offset + limit < (count || 0),
        hasPrevPage: page > 1
    };
}





export const getFeedback = async (interviewId: string) => {
    const { userId } = await auth();
    
    // Return null if not authenticated
    if (!userId) {
        return null;
    }

    console.log("GetFeedback called for:", { interviewId, userId });

    const supabase = await createClient();
    
    // First, let's see all records for this interview (for debugging)
    const { data: allRecords } = await supabase
        .from('session_history')
        .select('id, feedback, overall_feedback, created_at')
        .eq('user_id', userId)
        .eq('interview_id', interviewId)
        .order('created_at', { ascending: false });
    
    console.log("All session_history records for this interview:", allRecords);
    
    const { data, error } = await supabase
        .from('session_history')
        .select('feedback, overall_feedback, id, created_at')
        .eq('user_id', userId)
        .eq('interview_id', interviewId)
        .not('feedback', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error) {
        console.log("GetFeedback error:", error);
        if (error.code === 'PGRST116') {
            // No feedback found
            console.log("No feedback found (PGRST116)");
            return null;
        }
        console.error("Database error:", error);
        throw new Error(`Failed to fetch feedback: ${error.message}`);
    }

    console.log("GetFeedback found data:", data);

    return {
        feedback: data.feedback,
        overallFeedback: data.overall_feedback,
        sessionId: data.id,
        createdAt: data.created_at
    };
}

export const saveFeedback = async (feedbackData: any, interviewId?: string, sessionId?: string) => {
    const { userId } = await auth();
    
    if (!userId) {
        throw new Error("User not authenticated");
    }

    if (!feedbackData) {
        throw new Error("Feedback is required");
    }

    console.log("SaveFeedback called with:", {
        feedbackDataKeys: Object.keys(feedbackData),
        feedbackData: feedbackData,
        interviewId,
        sessionId,
        userId
    });

    const supabase = await createClient();
    
    // Extract overall feedback to save in separate column
    const overallFeedback = feedbackData.overallFeedback || null;
    
    console.log("Extracted overallFeedback:", overallFeedback);
    
    // If sessionId is provided, update existing session_history record
    if (sessionId) {
        console.log("Updating existing session with ID:", sessionId);
        
        // First, get the session data to calculate duration
        const { data: sessionData, error: sessionError } = await supabase
            .from('session_history')
            .select('created_at')
            .eq('id', sessionId)
            .eq('user_id', userId)
            .single();

        if (sessionError) {
            console.error("Error fetching session data:", sessionError);
            throw new Error(`Failed to fetch session data: ${sessionError.message}`);
        }

        const { data, error } = await supabase
            .from('session_history')
            .update({
                feedback: feedbackData,
                overall_feedback: overallFeedback
            })
            .eq('id', sessionId)
            .eq('user_id', userId)
            .select();

        if (error) {
            console.error("Database error updating feedback:", error);
            throw new Error(`Failed to update feedback: ${error.message}`);
        }

        console.log("Feedback update result:", data);

        // Note: Usage tracking now happens at session start, not completion

        return {
            success: true,
            sessionId: sessionId,
            message: "Feedback updated successfully"
        };
    } else {
        console.log("Creating new session_history record with feedback");
        
        // For new records without existing session data, we can't calculate duration
        // This case typically shouldn't happen in normal flow, but we handle it gracefully
        const { data, error } = await supabase
            .from('session_history')
            .insert({
                feedback: feedbackData,
                overall_feedback: overallFeedback,
                user_id: userId,
                interview_id: interviewId,
                created_at: new Date().toISOString()
            })
            .select();

        if (error) {
            console.error("Database error inserting feedback:", error);
            throw new Error(`Failed to save feedback: ${error.message}`);
        }

        console.log("Feedback insert result:", data);
        console.warn("Created new session without existing interview data - usage tracking skipped");

        return {
            success: true,
            sessionId: data[0].id,
            message: "Feedback saved successfully"
        };
    }
}

// Workflow state management functions
export const getWorkflowState = async (interviewId: string) => {
    const { userId } = await auth();
    
    // Return default state if not authenticated
    if (!userId) {
        return {
            currentPhaseId: 'self_intro',
            questionCounts: {},
            fulfilled: {},
            failedPhases: [],
            finished: false,
            conversationHistory: [],
            sessionId: null,
            workflowDefinition: null
        };
    }

    const supabase = await createClient();
    const { data, error } = await supabase
        .from('session_history')
        .select('id, workflow_state, current_phase_id, question_counts, failed_phases, interview_finished, conversation_history')
        .eq('user_id', userId)
        .eq('interview_id', interviewId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error) {
        if (error.code === 'PGRST116') {
            // No workflow state found - return initial state
            return {
                currentPhaseId: 'self_intro',
                questionCounts: {},
                fulfilled: {},
                failedPhases: [],
                finished: false,
                conversationHistory: [],
                sessionId: null,
                workflowDefinition: null
            };
        }
        console.error("Database error:", error);
        throw new Error(`Failed to fetch workflow state: ${error.message}`);
    }

    return {
        currentPhaseId: data.current_phase_id || 'self_intro',
        questionCounts: data.question_counts || {},
        fulfilled: data.workflow_state?.fulfilled || {},
        failedPhases: Array.isArray(data.failed_phases) ? data.failed_phases : [],
        finished: data.interview_finished || false,
        conversationHistory: Array.isArray(data.conversation_history) ? data.conversation_history : [],
        sessionId: data.id,
        workflowDefinition: data.workflow_state?.workflowDefinition || null
    };
}

export const saveWorkflowState = async (
    interviewId: string,
    workflowState: {
        currentPhaseId: string;
        questionCounts: Record<string, number>;
        fulfilled: Record<string, Record<string, string>>;
        failedPhases: string[];
        finished: boolean;
        workflowDefinition?: any[];
        totalQuestionsAsked?: number;
    },
    conversationHistory: any[],

) => {
    const { userId } = await auth();
    
    if (!userId) {
        throw new Error("User not authenticated");
    }

    const supabase = await createClient();
    
    // Generate a unique session ID for new sessions
    const sessionId = `session_${interviewId}_${Date.now()}`;
    
    // Prepare the data to upsert
    const upsertData = {
        user_id: userId,
        interview_id: interviewId,
        session_id: sessionId, // Add the required session_id field
        workflow_state: {
            ...workflowState,
            workflowDefinition: workflowState.workflowDefinition
        },
        state: {}, // Add required state field (can be empty object)
        current_phase_id: workflowState.currentPhaseId,
        question_counts: workflowState.questionCounts,
        failed_phases: workflowState.failedPhases,
        interview_finished: workflowState.finished,
        conversation_history: conversationHistory,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_message_at: new Date().toISOString(),
    };

    // First try to update existing record, then insert if not exists
    const { data: existingData } = await supabase
        .from('session_history')
        .select('id')
        .eq('user_id', userId)
        .eq('interview_id', interviewId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    let result;
    if (existingData) {
        // Update existing record
        result = await supabase
            .from('session_history')
            .update({
                workflow_state: {
                    ...workflowState,
                    workflowDefinition: workflowState.workflowDefinition
                },
                current_phase_id: workflowState.currentPhaseId,
                question_counts: workflowState.questionCounts,
                failed_phases: workflowState.failedPhases,
                interview_finished: workflowState.finished,
                conversation_history: conversationHistory,
                updated_at: new Date().toISOString(),
                last_message_at: new Date().toISOString(),
            })
            .eq('id', existingData.id)
            .select();
    } else {
        // Insert new record
        result = await supabase
            .from('session_history')
            .insert(upsertData)
            .select();
    }

    const { data, error } = result;

    if (error) {
        console.error("Database error saving workflow state:", error);
        console.error("Attempted data:", upsertData);
        throw new Error(`Failed to save workflow state: ${error.message}`);
    }

    return {
        success: true,
        sessionId: data[0].id,
        message: "Workflow state saved successfully"
    };
}

/**
 * Track interview session start - adds to usage count when session begins
 * This function is called when a user starts a new interview session
 */
export const trackInterviewStart = async () => {
    try {
        console.log("Tracking interview session start...");
        await trackInterviewSessionStart();
        console.log("Interview session start tracked successfully");
        return { success: true };
    } catch (error) {
        console.error("Error tracking interview session start:", error);
        return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
    }
};