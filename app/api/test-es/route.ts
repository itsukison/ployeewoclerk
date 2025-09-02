import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/supabase/auth";

export async function GET() {
  try {
    const { userId } = await auth();
    
    return NextResponse.json({
      success: true,
      userId: userId || "No user",
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasSupabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Test API error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const body = await request.json();
    
    return NextResponse.json({
      success: true,
      userId: userId || "No user",
      receivedData: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Test POST API error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}