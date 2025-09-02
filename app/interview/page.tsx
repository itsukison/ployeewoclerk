import React from "react";
import Link from "next/link";
import { getAllInterviews } from "@/lib/actions/interview.actions";
import AutoSignIn from "@/components/ui/AutoSignIn";
import FilterControls from "@/components/ui/FilterControls";

// Helper function to translate interview focus to Japanese
const getInterviewFocusLabel = (focus: string) => {
  const focusMap: { [key: string]: string } = {
    consulting: "コンサル",
    finance: "金融",
    manufacturing: "メーカー",
    trading: "商社",
    it: "IT・通信",
    advertising: "広告・マスコミ",
    hr: "人材",
    infrastructure: "インフラ",
    real_estate: "不動産・建設",
    // Legacy mappings for backwards compatibility
    case: "ケース面接",
    technical: "テクニカル面接",
    final: "最終面接",
    general: "一般的な行動面接",
    product: "プロダクト・ケース面接",
    leadership: "リーダーシップ面接",
    custom: "カスタム",
  };
  return focusMap[focus] || focus;
};

interface Interview {
  id: string;
  companyName?: string;
  company_name?: string;
  interviewFocus?: string;
  interview_focus?: string;
  created_at: string;
  author?: string;
}

interface InterviewData {
  interviews: Interview[];
  total: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PageProps {
  searchParams: Promise<{
    page?: string;
    filter?: string;
    sort?: string;
  }>;
}

const InterviewPage = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams;
  const currentPage = parseInt(resolvedSearchParams.page || "1");
  const filter = resolvedSearchParams.filter || "all";
  const sortBy = resolvedSearchParams.sort || "newest";

  let interviewData: InterviewData = {
    interviews: [],
    total: 0,
    currentPage: 1,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  };

  try {
    interviewData = await getAllInterviews(currentPage, 12, filter, sortBy);
  } catch (error) {
    console.error("Failed to fetch interviews:", error);
  }

  const { interviews, total, totalPages, hasNextPage, hasPrevPage } =
    interviewData;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AutoSignIn nonClosableModal={true}>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-[#163300] mb-2">
                  全ての面接セッション
                </h1>
                <p className="text-gray-600">
                  全ユーザーの面接練習セッションを確認できます ({total}件)
                </p>
              </div>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium text-[#163300] bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ダッシュボード
              </Link>
            </div>
          </div>

          <FilterControls currentFilter={filter} currentSort={sortBy} />

          {interviews.length === 0 ? (
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#163300] mb-2">
                まだ面接セッションがありません
              </h3>
              <p className="text-gray-600 mb-6">
                最初の面接練習を始めてみましょう
              </p>
              <Link
                href="/interview/new"
                className="inline-block bg-[#9fe870] text-[#163300] px-6 py-3 rounded-full font-semibold hover:bg-[#8fd960] transition-colors"
              >
                面接練習を始める
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {interviews.map((interview: Interview) => (
                  <Link
                    key={interview.id}
                    href={`/feedback/${interview.id}`}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer block"
                  >
                    {/* Placeholder Image */}
                    <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a2 2 0 012-2h2a2 2 0 012 2v5m-6 0h6"
                        />
                      </svg>
                    </div>

                    {/* Interview Details */}
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-[#163300] line-clamp-1">
                        {interview.companyName || interview.company_name}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="inline-block px-2 py-1 bg-[#9fe870]/20 text-[#163300] rounded-full text-xs font-medium">
                          {getInterviewFocusLabel(
                            interview.interviewFocus ||
                              interview.interview_focus ||
                              ""
                          )}
                        </span>
                        <time>
                          {new Date(interview.created_at).toLocaleDateString(
                            "ja-JP",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </time>
                      </div>
                      {interview.author && (
                        <div className="text-xs text-gray-400 truncate">
                          ユーザー: {interview.author.slice(0, 8)}...
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center space-x-2">
                  {hasPrevPage && (
                    <Link
                      href={`/interview?page=${
                        currentPage - 1
                      }&filter=${filter}&sort=${sortBy}`}
                      className="px-4 py-2 text-sm font-medium text-[#163300] bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      前へ
                    </Link>
                  )}

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <Link
                          key={pageNum}
                          href={`/interview?page=${pageNum}&filter=${filter}&sort=${sortBy}`}
                          className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            pageNum === currentPage
                              ? "bg-[#9fe870] text-[#163300]"
                              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    })}
                  </div>

                  {hasNextPage && (
                    <Link
                      href={`/interview?page=${
                        currentPage + 1
                      }&filter=${filter}&sort=${sortBy}`}
                      className="px-4 py-2 text-sm font-medium text-[#163300] bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      次へ
                    </Link>
                  )}
                </div>
              )}

              {/* Page info */}
              <div className="mt-6 text-center text-sm text-gray-600">
                ページ {currentPage} / {totalPages} (全 {total} セッション)
              </div>
            </>
          )}
        </AutoSignIn>
      </div>
    </div>
  );
};

export default InterviewPage;
