import { NextRequest, NextResponse } from 'next/server';
import { trackInterviewStart } from '@/lib/actions/interview.actions';
import { canStartSession } from '@/lib/actions/usage.actions';

export async function POST(request: NextRequest) {
  try {
    // First check if user can start a new session
    const usageCheck = await canStartSession();
    
    if (!usageCheck.canStart) {
      return NextResponse.json({ 
        success: false, 
        error: 'Usage limit exceeded',
        currentUsage: usageCheck.currentUsage,
        planLimit: usageCheck.planLimit,
        redirectTo: '/billing'
      }, { status: 429 });
    }

    // Track interview session start
    const result = await trackInterviewStart();
    
    if (result.success) {
      return NextResponse.json({ 
        success: true,
        currentUsage: usageCheck.currentUsage + 1,
        planLimit: usageCheck.planLimit,
        remainingInterviews: usageCheck.remainingInterviews - 1
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in track-interview-start API:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}