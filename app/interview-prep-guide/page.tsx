"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InterviewPrepGuide() {
  const router = useRouter();

  useEffect(() => {
    router.push("/blog");
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-[#9fe870] rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
          <svg className="w-8 h-8 text-[#163300]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#163300] mb-2">面接対策ガイドへリダイレクト中...</h1>
        <p className="text-gray-600">ブログページで役立つ情報をご覧ください</p>
      </div>
    </div>
  );
}