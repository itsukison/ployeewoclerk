import { NextRequest, NextResponse } from 'next/server';
import { saveWorkflowState } from '@/lib/actions/interview.actions';
import { auth } from '@/lib/supabase/auth';

export async function POST(request: NextRequest) {
  try {
    const { interviewId } = await request.json();
    
    if (!interviewId) {
      return NextResponse.json({ error: "Interview ID is required" }, { status: 400 });
    }

    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Initialize workflow state for the interview session
    const initialWorkflowState = {
      currentPhaseId: 'self_intro',
      questionCounts: {},
      fulfilled: {},
      failedPhases: [],
      finished: false,
      totalQuestionsAsked: 0
    };

    // Create initial conversation history with intro message
    const initialConversationHistory = [
      {
        role: "assistant" as const,
        content: "本日は面接にお越しいただきありがとうございます。まずは簡単に自己紹介をお願いします。",
        timestamp: Date.now()
      }
    ];

    // Save initial session state to database
    const result = await saveWorkflowState(
      interviewId,
      initialWorkflowState,
      initialConversationHistory
    );

    return NextResponse.json({
      success: true,
      sessionId: result.sessionId,
      message: "Interview session initialized successfully"
    });

  } catch (error) {
    console.error('Error initializing interview session:', error);
    return NextResponse.json({ 
      error: 'Failed to initialize interview session' 
    }, { status: 500 });
  }
}