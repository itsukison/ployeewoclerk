"use client";

import React, { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInterviewSession } from "../../../hooks/useInterviewSession";
import soundwavesAnimation from "../../../constants/soundwaves.json";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface Interview {
  id: string;
  name?: string;
  education?: string;
  company_name?: string;
  companyName?: string;
  interview_focus?: string;
  interviewFocus?: string;
  questions?: string[];
}

interface InterviewSessionClientProps {
  interview: Interview;
}

enum InterviewStatus {
  INACTIVE = "INACTIVE",
  ACTIVE = "ACTIVE",
  PROCESSING = "PROCESSING",
}

const InterviewSessionClient = ({ interview }: InterviewSessionClientProps) => {
  const router = useRouter();
  const lottieRef = useRef<HTMLDivElement>(null);

  // Helper function to translate interview focus to Japanese
  const getInterviewFocusLabel = (focus: string) => {
    const focusMap: { [key: string]: string } = {
      consulting: "コンサルティング業界",
      finance: "金融業界",
      manufacturing: "メーカー・製造業界",
      trading: "商社業界",
      it: "IT・通信業界",
      advertising: "広告・マスコミ業界",
      hr: "人材業界",
      infrastructure: "インフラ業界",
      real_estate: "不動産・建設業界",
    };
    return focusMap[focus] || "面接練習";
  };

  const {
    isActive,
    isProcessing,
    isSpeaking,
    isPlayingTTS,
    conversationHistory,
    isMuted,
    toggleRecording,
    toggleMute,
    generateFeedbackAndRedirect,
  } = useInterviewSession(interview.id);

  const getLatestInterviewerQuestion = () => {
    if (conversationHistory.length === 0) return null;
    for (let i = conversationHistory.length - 1; i >= 0; i--) {
      if (conversationHistory[i].role === "assistant") {
        return conversationHistory[i];
      }
    }
    return null;
  };

  useEffect(() => {
    const loadLottie = async () => {
      if (typeof window !== "undefined") {
        const lottie = await import("lottie-web");
        if (lottieRef.current) {
          lottieRef.current.innerHTML = "";
          const animation = lottie.default.loadAnimation({
            container: lottieRef.current,
            renderer: "svg",
            loop: true,
            autoplay: false,
            animationData: soundwavesAnimation,
          });
          if (isActive && (isSpeaking || isPlayingTTS)) {
            animation.play();
          } else {
            animation.pause();
          }
          return () => animation.destroy();
        }
      }
    };
    loadLottie();
  }, [isSpeaking, isPlayingTTS, isActive]);

  const companyName =
    interview.company_name || interview.companyName || "AI面接官";

  const industryFocus = interview.interviewFocus || interview.interview_focus || "";
  const industryLabel = getInterviewFocusLabel(industryFocus);

  return (
    <div className="h-[calc(100vh-64px)] bg-white flex flex-col overflow-hidden">
      <div className="flex-shrink-0 bg-white py-6">
        <div className="max-w-6xl mx-auto px-2 text-center">
          <h1 className="text-4xl font-bold text-[#163300] mb-3 mt-8">
            {companyName}
          </h1>
          <p className="text-xl text-gray-600 mb-3">{industryLabel}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-2 overflow-hidden">
        <div className="w-full max-w-5xl h-full flex flex-col justify-center space-y-3">
          <div className="flex justify-center flex-shrink-0 -mt-20">
            <div
              ref={lottieRef}
              className={`w-80 h-80 transition-opacity duration-300 ${
                isActive && (isSpeaking || isPlayingTTS)
                  ? "opacity-100"
                  : "opacity-30"
              }`}
            />
          </div>

          <div className="flex-shrink-0 px-1">
            <div className="h-28 w-full max-w-5xl mx-auto p-5 bg-gray-50 rounded-2xl border-2 border-transparent transition-all duration-200 overflow-y-auto">
              {isActive && getLatestInterviewerQuestion() ? (
                <div className="text-base leading-relaxed h-full flex items-center">
                  <p className="text-gray-700 w-full text-center">
                    {getLatestInterviewerQuestion()?.content}
                  </p>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-400 text-base">
                    {isActive
                      ? "面接官からの質問がここに表示されます"
                      : "面接を開始すると質問が表示されます"}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex-shrink-0 flex justify-center mt-5">
            <div className="flex justify-center gap-4 flex-wrap min-h-[70px] items-center">
              {!isActive && !isProcessing && (
                <button
                  onClick={toggleRecording}
                  className="cursor-pointer bg-[#9fe870] text-[#163300] px-12 py-4 rounded-full font-bold text-xl hover:bg-[#8fd960] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  面接を開始
                </button>
              )}

              {isActive && (
                <div className="flex gap-4">
                  <button
                    onClick={isProcessing ? undefined : toggleMute}
                    disabled={isProcessing}
                    className={`px-8 py-4 rounded-full font-semibold transition-all duration-200 flex items-center gap-3 text-base ${
                      isProcessing
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : isMuted
                        ? "bg-[#9fe870] text-[#163300] hover:bg-[#8fd960] cursor-pointer"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300 cursor-pointer"
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <LoadingSpinner size="sm" color="#6b7280" />
                        処理中...
                      </>
                    ) : isMuted ? (
                      "ミュート中"
                    ) : (
                      "ミュート"
                    )}
                  </button>

                  <button
                    onClick={async () => {
                      toggleRecording();
                      setTimeout(async () => {
                        await generateFeedbackAndRedirect(interview.id);
                      }, 1000);
                    }}
                    className="cursor-pointer bg-red-500 text-white px-10 py-4 rounded-full font-bold text-base hover:bg-red-600 transition-all duration-200"
                  >
                    面接を終了
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSessionClient;
