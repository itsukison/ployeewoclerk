"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const FeedbackLoadingPage = () => {
  const params = useParams();
  const router = useRouter();
  const [dots, setDots] = useState("");
  const [progress, setProgress] = useState(0);

  const interviewId = params.id as string;

  // Animate dots for loading effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // Simulate progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev; // Cap at 95% to avoid reaching 100% before actual completion
        return prev + Math.random() * 3;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  // Generate feedback and check if it's ready
  useEffect(() => {
    let feedbackGenerated = false;

    const generateFeedback = async () => {
      if (feedbackGenerated) return;
      feedbackGenerated = true;

      try {
        console.log("Starting feedback generation on loading page...");

        // First check if feedback already exists
        const statusResponse = await fetch(
          `/api/check-feedback-status/${interviewId}`
        );
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          if (statusData.feedbackReady) {
            console.log("Feedback already exists, redirecting...");
            setProgress(100);
            setTimeout(() => {
              router.push(`/feedback/${interviewId}`);
            }, 500);
            return;
          }
        }

        // Get interview data for feedback generation
        const workflowResponse = await fetch(
          `/api/get-workflow-state/${interviewId}`
        );

        if (!workflowResponse.ok) {
          throw new Error("Failed to fetch interview data");
        }

        const workflowStateData = await workflowResponse.json();

        if (
          !workflowStateData?.conversationHistory ||
          workflowStateData.conversationHistory.length === 0
        ) {
          console.error("No conversation history found");
          router.push(`/feedback/${interviewId}`);
          return;
        }

        console.log("Calling generate-feedback API...");

        // Generate feedback
        const feedbackResponse = await fetch("/api/generate-feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationHistory: workflowStateData.conversationHistory,
            workflowState: workflowStateData,
            interviewId: interviewId,
          }),
        });

        if (!feedbackResponse.ok) {
          const errorData = await feedbackResponse
            .json()
            .catch(() => ({ error: "Unknown error" }));
          throw new Error(
            errorData.error ||
              `API request failed with status ${feedbackResponse.status}`
          );
        }

        const feedbackData = await feedbackResponse.json();
        console.log("Feedback generated successfully:", feedbackData);

        // Save feedback to database
        const saveResponse = await fetch("/api/save-feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            feedbackData,
            interviewId,
            sessionId: workflowStateData.sessionId,
          }),
        });

        if (!saveResponse.ok) {
          throw new Error("Failed to save feedback");
        }

        console.log("Feedback saved successfully");

        // Complete and redirect
        setProgress(100);
        setTimeout(() => {
          router.push(`/feedback/${interviewId}`);
        }, 1000);
      } catch (error) {
        console.error("Error generating feedback:", error);
        // Redirect to feedback page anyway after delay
        setTimeout(() => {
          router.push(`/feedback/${interviewId}`);
        }, 3000);
      }
    };

    // Start generation immediately
    generateFeedback();

    // Fallback: redirect after 30 seconds regardless
    const fallbackTimeout = setTimeout(() => {
      router.push(`/feedback/${interviewId}`);
    }, 30000);

    return () => {
      clearTimeout(fallbackTimeout);
    };
  }, [interviewId, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto px-6">
        {/* Main Loading Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/50 p-12 text-center">
          {/* Loading Animation */}
          <div className="mb-8">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full bg-slate-100 animate-pulse" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
                <LoadingSpinner size="md" color="#ffffff" />
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-light text-slate-900 mb-3 tracking-tight">
            フィードバックを準備中
          </h1>

          {/* Description */}
          <p className="text-slate-600 text-lg leading-relaxed font-light">
            AIが面接内容を分析しています
          </p>

          {/* Subtle Divider */}
          <div className="my-8 flex justify-center">
            <div className="w-12 h-px bg-slate-200" />
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="relative w-full bg-slate-100 rounded-full h-1 overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-slate-900 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progress, 98)}%` }}
              />
            </div>
            <p className="text-sm text-slate-500 mt-3 font-light">
              {Math.round(progress)}%
            </p>
          </div>

          {/* Status Steps */}
          <div className="space-y-4 text-left max-w-xs mx-auto">
            <div className="flex items-center space-x-3">
              <div
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  progress > 20 ? "bg-slate-900" : "bg-slate-300"
                }`}
              />
              <span
                className={`text-sm transition-colors duration-300 ${
                  progress > 20 ? "text-slate-700" : "text-slate-400"
                }`}
              >
                会話を分析中
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  progress > 50 ? "bg-slate-900" : "bg-slate-300"
                }`}
              />
              <span
                className={`text-sm transition-colors duration-300 ${
                  progress > 50 ? "text-slate-700" : "text-slate-400"
                }`}
              >
                評価レポート作成中
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  progress > 80 ? "bg-slate-900" : "bg-slate-300"
                }`}
              />
              <span
                className={`text-sm transition-colors duration-300 ${
                  progress > 80 ? "text-slate-700" : "text-slate-400"
                }`}
              >
                改善提案を準備中
              </span>
            </div>
          </div>

          {/* Minimal Note */}
          <div className="mt-10">
            <p className="text-xs text-slate-400 font-light">
              完了まで 1-2 分程度
            </p>
          </div>
        </div>

        {/* Subtle Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-slate-100 rounded-full opacity-20 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-200 rounded-full opacity-10 blur-3xl" />
        </div>
      </div>
    </div>
  );
};

export default FeedbackLoadingPage;
