"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AutoSignIn from "@/components/ui/AutoSignIn";

interface ESCorrection {
  id: string;
  company_name: string;
  question: string;
  answer: string;
  overall_score: number;
  match_score: number;
  structure_score: number;
  basic_score: number;
  created_at: string;
  status: string;
}

const ESHistoryPage = () => {
  const router = useRouter();
  const [corrections, setCorrections] = useState<ESCorrection[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCorrections = async () => {
      try {
        setLoading(true);
        setError("");
        
        const response = await fetch(`/api/es-corrections?page=${currentPage}&limit=9`);
        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }
        
        const result = await response.json();
        setCorrections(result.corrections);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error("Failed to fetch ES corrections:", error);
        setError("ES添削履歴の取得に失敗しました");
        setCorrections([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCorrections();
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-[#9fe870]";
    if (score >= 80) return "text-[#ff8c5a]";
    return "text-red-500";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return "bg-[#9fe870]/20";
    if (score >= 80) return "bg-[#ff8c5a]/20";
    return "bg-red-100";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            完了
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            処理中
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            失敗
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            不明
          </span>
        );
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AutoSignIn nonClosableModal={true}>
          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 text-sm font-medium text-[#163300] bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← ダッシュボード
              </button>
              <div className="flex-1 text-center">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#163300] mb-4">
                  ES添削履歴
                </h1>
                <p className="text-base sm:text-lg text-gray-600">
                  これまでのエントリーシート添削履歴を確認できます
                </p>
              </div>
              <div className="w-[120px]"></div> {/* Spacer for centering */}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-600">読み込み中...</p>
            </div>
          ) : corrections.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#163300] mb-2">
                まだES添削がありません
              </h3>
              <p className="text-gray-600 mb-6">
                最初のES添削を始めてみましょう
              </p>
              <Link
                href="/es-correction"
                className="inline-block bg-[#9fe870] text-[#163300] px-6 py-3 rounded-full font-semibold hover:bg-[#8fd960] transition-colors"
              >
                ES添削を始める
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {corrections.map((correction) => (
                  <div
                    key={correction.id}
                    className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Header */}
                    <div className="p-6 pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-[#163300] line-clamp-1">
                          {correction.company_name}
                        </h3>
                        {getStatusBadge(correction.status)}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {truncateText(correction.question, 80)}
                      </p>

                      {correction.status === "completed" && (
                        <div className="flex items-center justify-between">
                          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreBgColor(correction.overall_score)}`}>
                            <span className={getScoreColor(correction.overall_score)}>
                              総合: {correction.overall_score}点
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Score Details for Completed */}
                    {correction.status === "completed" && (
                      <div className="px-6 pb-4">
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-gray-500">マッチ</div>
                            <div className={`font-semibold ${getScoreColor(correction.match_score)}`}>
                              {correction.match_score}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-500">構成</div>
                            <div className={`font-semibold ${getScoreColor(correction.structure_score)}`}>
                              {correction.structure_score}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-gray-500">基本</div>
                            <div className={`font-semibold ${getScoreColor(correction.basic_score)}`}>
                              {correction.basic_score}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                      <div className="flex items-center justify-between">
                        <time className="text-xs text-gray-500">
                          {new Date(correction.created_at).toLocaleDateString("ja-JP", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                        
                        {correction.status === "completed" ? (
                          <Link
                            href={`/es-correction/result/${correction.id}`}
                            className="text-sm font-medium text-[#9fe870] hover:text-[#8fd960] transition-colors"
                          >
                            結果を見る →
                          </Link>
                        ) : correction.status === "processing" ? (
                          <span className="text-sm text-gray-500">処理中...</span>
                        ) : (
                          <span className="text-sm text-red-500">エラー</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-3 mt-12 mb-8">
                  <span className="text-gray-600 text-md">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-1.5 rounded-md text-md font-medium transition-colors ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-[#9fe870] text-[#163300] hover:bg-[#8fd960]"
                    }`}
                  >
                    前へ
                  </button>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1.5 rounded-md text-md font-medium transition-colors ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-[#9fe870] text-[#163300] hover:bg-[#8fd960]"
                    }`}
                  >
                    次へ
                  </button>
                </div>
              )}

              {/* Action Button */}
              <div className="text-center mt-8">
                <Link
                  href="/es-correction"
                  className="inline-block bg-[#9fe870] text-[#163300] px-8 py-3 rounded-full font-semibold hover:bg-[#8fd960] transition-colors shadow-lg"
                >
                  新しいES添削を始める
                </Link>
              </div>
            </>
          )}
        </AutoSignIn>
      </div>
    </div>
  );
};

export default ESHistoryPage;