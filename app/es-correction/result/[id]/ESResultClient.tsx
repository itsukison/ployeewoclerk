"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { InterviewRadarChart } from "@/components/ui/charter";
import AutoSignIn from "@/components/ui/AutoSignIn";

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

interface ESResultClientProps {
  esData: ESCorrectionData;
}

const ESResultClient = ({ esData }: ESResultClientProps) => {
  const router = useRouter();

  const formatFeedback = (feedback: string) => {
    // Primary: parse by expected bracketed sections
    const bracketed = feedback.split(/【([^】]+)】/).filter(Boolean);
    const formattedSections: { title: string; content: string }[] = [];

    if (bracketed.length >= 2) {
      for (let i = 0; i < bracketed.length; i += 2) {
        const title = bracketed[i];
        const content = bracketed[i + 1];
        if (!title || !content) continue;
        if (title === "ES総合点") continue;
        if (title === "ESの構成" || title === "基本チェック") {
          const idx = formattedSections.findIndex(
            (s) => s.title === "構成と基本チェック"
          );
          if (idx >= 0) {
            formattedSections[idx].content += "\n\n" + content.trim();
          } else {
            formattedSections.push({
              title: "構成と基本チェック",
              content: content.trim(),
            });
          }
          continue;
        }
        formattedSections.push({ title, content: content.trim() });
      }
      if (formattedSections.length > 0) return formattedSections.slice(0, 3);
    }

    // Fallback: parse markdown style headings like "### 見出し"
    const mdMatches = feedback.split(/\n(?=\s*#{2,3}\s+)/);
    if (mdMatches.length > 1) {
      const collected: { title: string; content: string }[] = [];
      for (const block of mdMatches) {
        const m = block.match(/\s*#{2,3}\s+([^\n]+)\n([\s\S]*)/);
        if (!m) continue;
        const title = m[1].trim();
        const content = (m[2] || "").trim();
        if (!title || !content) continue;
        if (title.includes("ES総合点")) continue;
        let normalizedTitle = title;
        if (title.includes("構成") || title.includes("基本")) {
          normalizedTitle = "構成と基本チェック";
          const idx = collected.findIndex((s) => s.title === normalizedTitle);
          if (idx >= 0) {
            collected[idx].content += "\n\n" + content;
            continue;
          }
        }
        collected.push({ title: normalizedTitle, content });
      }
      if (collected.length > 0) return collected.slice(0, 3);
    }

    // Final fallback: return as a single section
    return [{ title: "分析結果", content: feedback }];
  };

  const feedbackSections = formatFeedback(esData.ai_feedback);

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "優秀";
    if (score >= 80) return "良好";
    if (score >= 70) return "改善の余地あり";
    return "要改善";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-8 sm:px-0 max-w-7xl mx-auto sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <AutoSignIn nonClosableModal={true}>
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h1 className="text-3xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#163300] mb-4 sm:mb-6">
              ES添削結果
            </h1>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600 font-semibold max-w-3xl mx-auto leading-relaxed">
              <strong>{esData.company_name}</strong>{" "}
              のエントリーシート分析結果をお届けします
            </p>
            <p className="text-sm text-gray-500 mt-4">
              分析日時:{" "}
              {new Date(esData.created_at).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* Merged Overall Score and Detailed Scores */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100 mb-8 sm:mb-8 lg:mb-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#163300] mb-6 sm:mb-8 text-center">
              総合評価
            </h2>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
              {/* Left Column: Score and Summary */}
              <div className="space-y-4 sm:space-y-6">
                {/* Overall Score Display */}
                <div className="text-center lg:text-left">
                  <div className="flex items-end gap-2 sm:gap-3 justify-center lg:justify-start">
                    <span className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-[#163300]">
                      {esData.overall_score}
                    </span>
                    <span className="pb-1 sm:pb-2 text-base sm:text-lg text-gray-500 font-medium">
                      /100
                    </span>
                  </div>
                  <p className="text-lg sm:text-xl font-semibold text-[#163300] mt-2">
                    {getScoreLabel(esData.overall_score)}
                  </p>
                </div>

                {/* Overall Summary */}
                <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-[#163300] mb-2">
                    総合フィードバック
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">
                    あなたのエントリーシートは全体的に
                    {getScoreLabel(esData.overall_score).toLowerCase()}です。
                    各項目のスコアを参考に、より効果的なES作成を目指しましょう。
                  </p>
                </div>
              </div>

              {/* Right Column: Radar Chart */}
              <div className="flex justify-center lg:justify-start">
                <div className="w-full max-w-[460px] sm:max-w-[400px] lg:max-w-[500px]">
                  <InterviewRadarChart
                    data={[
                      { criteria: "マッチ度", score: esData.match_score },
                      { criteria: "構成力", score: esData.structure_score },
                      { criteria: "基本チェック", score: esData.basic_score },
                      {
                        criteria: "具体性",
                        score: Math.round(
                          (esData.match_score + esData.structure_score) / 2
                        ),
                      },
                      {
                        criteria: "説得力",
                        score: Math.round(
                          (esData.structure_score + esData.basic_score) / 2
                        ),
                      },
                    ]}
                    frameless={true}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Analysis Results */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100 mb-8 sm:mb-8 lg:mb-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#163300] mb-6 sm:mb-8 text-center">
              AI分析結果
            </h2>
            <div className="space-y-6 sm:space-y-8">
              {feedbackSections.map((section, index) => (
                <div
                  key={index}
                  className="p-4 sm:p-6 bg-gray-50 rounded-xl border-l-4 border-[#9fe870]"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-[#163300] mb-3 sm:mb-4">
                    {section.title}
                  </h3>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Original Submission */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-100 mb-8 sm:mb-8 lg:mb-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#163300] mb-6 sm:mb-8 text-center">
              提出内容
            </h2>
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#163300] mb-3 sm:mb-4">
                  質問
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 sm:p-6 text-gray-700 text-sm sm:text-base leading-relaxed">
                  {esData.question}
                </div>
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#163300] mb-3 sm:mb-4">
                  あなたの回答
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 sm:p-6 text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {esData.answer}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8 sm:mt-12 lg:mt-16 justify-center">
            <button
              onClick={() => router.push("/es-correction")}
              className="bg-[#9fe870] text-[#163300] hover:bg-[#8fd960] w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-semibold rounded-xl sm:rounded-2xl min-w-0 sm:min-w-[200px] shadow-md hover:shadow-lg transition-all duration-200"
            >
              新しいES添削を始める
            </button>
            <button
              onClick={() => router.push("/es-correction/history")}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-semibold border border-gray-300 rounded-xl sm:rounded-2xl min-w-0 sm:min-w-[200px] hover:bg-gray-50 transition-all duration-200"
            >
              過去のES添削を見る
            </button>
          </div>
        </AutoSignIn>
      </div>
    </div>
  );
};

export default ESResultClient;
