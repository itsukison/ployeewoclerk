import React from "react";
import { notFound } from "next/navigation";
import { auth } from "@/lib/supabase/auth";
import { supabaseAdmin } from "@/lib/supabase/client";
import ESResultClient from "./ESResultClient";

interface ESCorrectionData {
  id: string;
  company_name: string;
  question: string;
  answer: string;
  ai_feedback: string;
  overall_score: number;
  match_score: number;
  structure_score: number;
  basic_score: number;
  created_at: string;
  status: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

const ESResultPage = async ({ params }: PageProps) => {
  const { userId } = await auth();
  const resolvedParams = await params;
  
  if (!userId) {
    notFound();
  }

  // Fetch ES correction data
  const { data: esData, error } = await supabaseAdmin
    .from("es_corrections")
    .select("*")
    .eq("id", resolvedParams.id)
    .eq("user_id", userId)
    .single();

  if (error || !esData) {
    console.error("ES correction fetch error:", error);
    notFound();
  }

  // Check if analysis is still processing
  if (esData.status === "processing") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-[#9fe870] rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg className="w-8 h-8 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#163300] mb-2">AI分析中...</h2>
          <p className="text-gray-600 mb-4">エントリーシートを詳細に分析しています</p>
          <div className="bg-[#9fe870]/10 rounded-xl p-4">
            <p className="text-sm text-gray-600">
              通常1-2分程度で完了します。このページを閉じずにお待ちください。
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check if analysis failed
  if (esData.status === "failed") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">分析に失敗しました</h2>
          <p className="text-gray-600 mb-4">申し訳ございません。もう一度お試しください。</p>
          <a 
            href="/es-correction" 
            className="inline-block bg-[#9fe870] text-[#163300] px-6 py-3 rounded-full font-semibold hover:bg-[#8fd960] transition-colors"
          >
            新しいES添削を始める
          </a>
        </div>
      </div>
    );
  }

  return <ESResultClient esData={esData as ESCorrectionData} />;
};

export default ESResultPage;