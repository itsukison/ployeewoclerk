import { NextRequest, NextResponse } from 'next/server';
import { canStartSession } from '@/lib/actions/usage.actions';

export async function GET(request: NextRequest) {
  try {
    const usageInfo = await canStartSession();
    
    return NextResponse.json(usageInfo);
  } catch (error) {
    console.error("Error checking usage limit:", error);
    
    if (error instanceof Error) {
      return NextResponse.json({ 
        error: `Failed to check usage limit: ${error.message}` 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: "Failed to check usage limit" 
    }, { status: 500 });
  }
}