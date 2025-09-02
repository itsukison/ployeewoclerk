import React from "react";
import { Button } from "@/components/ui/button";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { getFeedback, getWorkflowState } from "@/lib/actions/interview.actions";
import { InterviewRadarChart } from "@/components/ui/charter";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface FeedbackPageProps {
  params: Promise<{ id: string }>;
}

// Interface for the feedback result
interface FeedbackItem {
  score: string;
  feedback: string;
}

interface OverallFeedback {
  score: number;
  feedback: string;
}

interface PhaseAnalysis {
  phase: string;
  completed: boolean;
  score: number;
  feedback: string;
}

interface DetailedFeedback {
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

const FeedbackPage = async ({ params }: FeedbackPageProps) => {
  const { id } = await params;

  // Fetch the saved feedback for this interview
  let workflowStateData = null;
  let feedbackData = null;

  try {
    // Get workflow state and feedback data
    const [workflowState, feedback] = await Promise.all([
      getWorkflowState(id),
      getFeedback(id),
    ]);

    workflowStateData = workflowState;
    feedbackData = feedback;
  } catch (error) {
    console.error("Error fetching feedback data:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#163300] mb-4 sm:mb-6">
            面接フィードバック
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 font-semibold max-w-3xl mx-auto leading-relaxed">
            あなたの面接パフォーマンスを詳しく分析し、
            <strong>具体的な改善点</strong>をお伝えします
          </p>
        </div>

        {/* Section 1: Overall Assessment */}
        {(() => {
          // Parse feedback data
          let overallFeedback: OverallFeedback | null = null;
          let chartData: { criteria: string; score: number }[] = [];

          // First try to get from overallFeedback field (direct save)
          if (feedbackData?.overallFeedback) {
            try {
              if (typeof feedbackData.overallFeedback === "string") {
                overallFeedback = JSON.parse(feedbackData.overallFeedback);
              } else if (typeof feedbackData.overallFeedback === "object") {
                overallFeedback = feedbackData.overallFeedback;
              }
            } catch (error) {
              console.error("Error parsing overallFeedback field:", error);
            }
          }

          // Try to get all data from the main feedback JSON field (new format)
          if (feedbackData?.feedback) {
            try {
              let parsedData = feedbackData.feedback;
              if (typeof feedbackData.feedback === "string") {
                parsedData = JSON.parse(feedbackData.feedback);
              }

              // Get overallFeedback if not already found
              if (!overallFeedback && parsedData?.overallFeedback) {
                overallFeedback = parsedData.overallFeedback;
              }

              // Get chartData from new format
              if (parsedData?.chartData) {
                chartData = Array.isArray(parsedData.chartData)
                  ? parsedData.chartData
                  : [parsedData.chartData];

                // Ensure scores are numbers and properly formatted
                chartData = chartData
                  .map((item) => ({
                    criteria: String(item.criteria || ""),
                    score: Math.max(
                      0,
                      Math.min(100, Math.round(Number(item.score) || 0))
                    ),
                  }))
                  .filter((item) => item.criteria); // Remove items with empty criteria
              }

              // Fallback: Get chartData from legacy phaseAnalysis format
              if (
                chartData.length === 0 &&
                parsedData?.phaseAnalysis &&
                Array.isArray(parsedData.phaseAnalysis)
              ) {
                chartData = parsedData.phaseAnalysis
                  .map((phase: any) => ({
                    criteria: String(phase.phase || ""),
                    score: Math.max(
                      0,
                      Math.min(100, Math.round(Number(phase.score) * 10))
                    ), // Convert 0-10 to 0-100 scale
                  }))
                  .filter(
                    (item: { criteria: string; score: number }) => item.criteria
                  );
              }
            } catch (error) {
              console.error("Error parsing main feedback data:", error);
            }
          }

          // Remove the fallback default data since the component has its own defaults
          // if (chartData.length === 0) {
          //   chartData = [
          //     { criteria: "コミュニケーション力", score: 70 },
          //     { criteria: "論理的思考力", score: 60 },
          //     { criteria: "志望動機の明確さ", score: 80 },
          //     { criteria: "自己分析力", score: 70 },
          //     { criteria: "成長意欲", score: 80 },
          //   ];
          // }

          return overallFeedback ? (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100 mb-6 sm:mb-8 lg:mb-10">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#163300] mb-6 sm:mb-8 text-center">
                総合評価
              </h2>

              {/* Two-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
                {/* Left Column: Score and Feedback */}
                <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
                  {/* Score Display */}
                  <div className="text-center lg:text-left">
                    <div className="flex items-end gap-2 sm:gap-3 justify-center lg:justify-start">
                      <span className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-[#163300]">
                        {overallFeedback.score}
                      </span>
                      <span className="pb-1 sm:pb-2 text-base sm:text-lg text-gray-500 font-medium">
                        /100
                      </span>
                    </div>
                  </div>

                  {/* Feedback Text */}
                  <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                    <h3 className="text-base sm:text-lg font-semibold text-[#163300]">
                      総合フィードバック
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-xs sm:text-sm whitespace-pre-line">
                      {overallFeedback.feedback}
                    </p>
                  </div>
                </div>

                {/* Right Column: Chart */}
                <div className="flex justify-center lg:justify-start order-1 lg:order-2">
                  <div className="w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px]">
                    <InterviewRadarChart
                      data={chartData.length > 0 ? chartData : undefined}
                      frameless={true}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {/* Section 2: フェーズ別フィードバック */}
        {(() => {
          let phaseAnalysis: PhaseAnalysis[] = [];

          // Get phase analysis data from main feedback field
          if (feedbackData?.feedback) {
            try {
              const parsedData =
                typeof feedbackData.feedback === "string"
                  ? JSON.parse(feedbackData.feedback)
                  : feedbackData.feedback;

              if (
                parsedData?.phaseAnalysis &&
                Array.isArray(parsedData.phaseAnalysis)
              ) {
                phaseAnalysis = parsedData.phaseAnalysis;
              }
            } catch (error) {
              console.error(
                "Error parsing phase analysis from feedback:",
                error
              );
            }
          }

          return phaseAnalysis.length > 0 ? (
            <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100 mb-10">
              <h2 className="text-3xl font-bold text-[#163300] mb-10 text-center">
                フェーズ別フィードバック
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {phaseAnalysis.map((phase, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-xl border border-gray-200 bg-gray-50 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h3 className="text-lg font-semibold text-[#163300]">
                        {phase.phase}
                      </h3>
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-bold text-[#163300]">
                          {phase.score}
                        </span>
                        <span className="text-sm text-gray-500 pb-1">/10</span>
                      </div>
                    </div>

                    {/* Progress bar representation with dynamic colors */}
                    <div className="w-full h-2 bg-gray-200 rounded-full mb-4 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-700 ${
                          phase.score >= 8
                            ? "bg-[#9fe870]" // Green for high scores (8-10)
                            : phase.score >= 5
                            ? "bg-[#fbbf24]" // Yellow for medium scores (5-7.9)
                            : "bg-[#f97316]" // Orange for low scores (0-4.9)
                        }`}
                        style={{
                          width: `${
                            Math.max(0, Math.min(10, phase.score)) * 10
                          }%`,
                        }}
                      />
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed">
                      {phase.feedback}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        })()}

        {/* Section 3: 改善点 & 強みハイライト */}
        {(() => {
          let improvements: string[] = [];
          let strengths: string[] = [];

          // Get improvements and strengths from main feedback field
          if (feedbackData?.feedback) {
            try {
              const parsedData =
                typeof feedbackData.feedback === "string"
                  ? JSON.parse(feedbackData.feedback)
                  : feedbackData.feedback;

              // Try new format first
              if (
                parsedData?.improvements &&
                Array.isArray(parsedData.improvements)
              ) {
                improvements = parsedData.improvements;
              }

              if (
                parsedData?.strengths &&
                Array.isArray(parsedData.strengths)
              ) {
                strengths = parsedData.strengths;
              }

              // Fallback to legacy detailedFeedback format
              if (improvements.length === 0 || strengths.length === 0) {
                if (parsedData?.detailedFeedback) {
                  if (
                    improvements.length === 0 &&
                    parsedData.detailedFeedback.improvements &&
                    Array.isArray(parsedData.detailedFeedback.improvements)
                  ) {
                    improvements = parsedData.detailedFeedback.improvements;
                  }
                  if (
                    strengths.length === 0 &&
                    parsedData.detailedFeedback.strengths &&
                    Array.isArray(parsedData.detailedFeedback.strengths)
                  ) {
                    strengths = parsedData.detailedFeedback.strengths;
                  }
                }
              }
            } catch (error) {
              console.error(
                "Error parsing improvements/strengths from feedback:",
                error
              );
            }
          }

          return improvements.length > 0 || strengths.length > 0 ? (
            <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100 mb-10">
              <h2 className="text-3xl font-bold text-[#163300] mb-10 text-center">
                改善点 & 強みハイライト
              </h2>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* 改善点 */}
                {improvements.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-[#163300] flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-orange-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      改善点
                    </h3>
                    <div className="space-y-4">
                      {improvements.map((improvement, index) => (
                        <div
                          key={index}
                          className="p-4 bg-orange-50 rounded-xl border-l-4 border-orange-400"
                        >
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {improvement}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 強みハイライト */}
                {strengths.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-[#163300] flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#9fe870]/20 rounded-full flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-[#163300]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      強みハイライト
                    </h3>
                    <div className="space-y-4">
                      {strengths.map((strength, index) => (
                        <div
                          key={index}
                          className="p-4 bg-[#9fe870]/10 rounded-xl border-l-4 border-[#9fe870]"
                        >
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {strength}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null;
        })()}

        {/* Show message if no feedback yet */}
        {workflowStateData &&
          workflowStateData.conversationHistory &&
          workflowStateData.conversationHistory.length > 0 &&
          !feedbackData && (
            <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100 mb-10">
              <h2 className="text-2xl font-semibold text-[#163300] mb-8">
                フィードバック準備中
              </h2>
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#9fe870]/20 rounded-full mb-6">
                  <LoadingSpinner size="lg" color="#163300" />
                </div>
                <p className="text-lg text-gray-600 mb-4">
                  面接の分析が完了次第、詳細なフィードバックをお届けします
                </p>
                <p className="text-sm text-gray-500">
                  通常1-2分程度でフィードバックが生成されます
                </p>
              </div>
            </div>
          )}

        {/* Show message if no interview data */}
        {(!workflowStateData ||
          !workflowStateData.conversationHistory ||
          workflowStateData.conversationHistory.length === 0) && (
          <div className="bg-white rounded-3xl p-10 shadow-lg border border-gray-100 mb-10">
            <div className="text-center py-12">
              <ExclamationTriangleIcon className="w-16 h-16 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                面接記録が見つかりません
              </h2>
              <p className="text-gray-600 mb-8">
                この面接のデータが見つからないか、まだ面接が完了していない可能性があります。
              </p>
              <Link href="/interview/new">
                <Button className="bg-[#9fe870] text-[#163300] hover:bg-[#8fd960] px-8 py-3 text-lg font-semibold rounded-2xl">
                  新しい面接を開始
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8 sm:mt-12 lg:mt-16 justify-center">
          <Link href="/interview/new">
            <Button className="bg-[#9fe870] text-[#163300] hover:bg-[#8fd960] w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-6 text-base sm:text-lg font-semibold rounded-2xl sm:rounded-3xl min-w-0 sm:min-w-[220px] shadow-md hover:shadow-lg transition-all duration-200">
              再度練習する
            </Button>
          </Link>
          <Link href="/past">
            <Button
              variant="outline"
              className="w-full sm:w-auto px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-6 text-base sm:text-lg font-semibold border-gray-300 rounded-2xl sm:rounded-3xl min-w-0 sm:min-w-[220px] hover:bg-gray-50 transition-all duration-200"
            >
              他の面接を見る
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
