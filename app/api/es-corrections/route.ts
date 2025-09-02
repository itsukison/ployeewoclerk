import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/supabase/auth";
import { supabaseAdmin } from "@/lib/supabase/client";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const sortBy = searchParams.get("sort") || "newest";

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
      return NextResponse.json(
        { error: "データの取得に失敗しました" },
        { status: 500 }
      );
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
      return NextResponse.json(
        { error: "データの取得に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      corrections: corrections || [],
      total,
      currentPage: page,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  } catch (error) {
    console.error("ES corrections API error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}