import { NextRequest, NextResponse } from 'next/server';
import { saveFeedback } from '@/lib/actions/interview.actions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { feedbackData, interviewId, sessionId } = body;

    if (!feedbackData) {
      return NextResponse.json({ error: "Feedback data is required" }, { status: 400 });
    }

    const result = await saveFeedback(feedbackData, interviewId, sessionId);
    
    return NextResponse.json(result);

  } catch (error) {
    console.error("Error saving feedback:", error);
    
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: `Failed to save feedback: ${error.message}` 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: "Failed to save feedback" 
    }, { status: 500 });
  }
}
