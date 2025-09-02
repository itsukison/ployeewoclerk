import { NextRequest, NextResponse } from 'next/server';
import { getWorkflowState } from '@/lib/actions/interview.actions';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: "Interview ID is required" }, { status: 400 });
    }

    const workflowStateData = await getWorkflowState(id);
    
    return NextResponse.json(workflowStateData);

  } catch (error) {
    console.error("Error getting workflow state:", error);
    return NextResponse.json({ 
      error: "Failed to get workflow state" 
    }, { status: 500 });
  }
}
