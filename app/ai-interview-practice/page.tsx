"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AIInterviewPractice() {
  const router = useRouter();

  useEffect(() => {
    router.push("/interview/new");
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#9fe870] rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
          <svg className="w-8 h-8 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#163300] mb-2">AI面接練習へリダイレクト中...</h1>
        <p className="text-gray-600">しばらくお待ちください</p>
      </div>
    </div>
  );
}