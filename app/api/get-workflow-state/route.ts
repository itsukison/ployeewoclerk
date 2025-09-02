import { NextRequest, NextResponse } from 'next/server';
import { getWorkflowState } from '@/lib/actions/interview.actions';
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

    // Get workflow state from database
    const workflowData = await getWorkflowState(interviewId);

    return NextResponse.json({
      success: true,
      workflowData
    });

  } catch (error) {
    console.error('Error getting workflow state:', error);
    return NextResponse.json({ 
      error: 'Failed to get workflow state' 
    }, { status: 500 });
  }
}