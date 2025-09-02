import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/supabase/auth";
import { supabaseAdmin } from "@/lib/supabase/client";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { userId } = await auth();
    const resolvedParams = await params;
    
    if (!userId) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const { data: correction, error } = await supabaseAdmin
      .from("es_corrections")
      .select("*")
      .eq("id", resolvedParams.id)
      .eq("user_id", userId)
      .single();

    if (error || !correction) {
      return NextResponse.json(
        { error: "ES添削が見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(correction);
  } catch (error) {
    console.error("ES correction fetch error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}