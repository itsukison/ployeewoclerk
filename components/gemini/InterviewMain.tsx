"use client";

import React, { useState, useEffect, useRef } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface InterviewMainProps {
  isActive: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  isPlayingTTS: boolean;
  hasSpokenInCurrentSession: boolean;
  silenceTimer: number;
  silenceDuration: number;
  response: string;
  error: string;
  interviewPhase: string;
  conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: number;
  }>;
  onToggleRecording: () => void;
}

export default function InterviewMain({
  isActive,
  isProcessing,
  isSpeaking,
  isPlayingTTS,
  hasSpokenInCurrentSession,
  silenceTimer,
  silenceDuration,
  response,
  error,
  interviewPhase,
  conversationHistory,
  onToggleRecording,
}: InterviewMainProps) {
  const getPhaseName = (phase: string) => {
    switch (phase) {
      case "introduction":
      case "self_intro":
        return "自己紹介";
      case "experience":
      case "gakuchika":
        return "ガクチカ/経験";
      case "skills":
      case "strength":
        return "強み/スキル";
      case "motivation":
      case "industry_motivation":
        return "志望動機";
      case "closing":
      case "weakness":
        return "弱み";
      case "end":
        return "終了";
      default:
        return phase;
    }
  };

  const silenceProgress = (silenceTimer / silenceDuration) * 100;

  return (
    <div className="space-y-6">
      {/* Recording Controls */}
      <div className="text-center">
        <button
          onClick={onToggleRecording}
          disabled={isProcessing}
          className={`px-8 py-4 rounded-full font-semibold text-lg transition-all ${
            isActive
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          } disabled:bg-gray-400 disabled:cursor-not-allowed`}
        >
          {isActive ? "会話終了" : "会話開始"}
        </button>
      </div>

      {/* Real-time Status */}
      {isActive && (
        <div className="text-center space-y-4">
          {/* Speaking Indicator */}
          <div className="flex items-center justify-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isSpeaking ? "bg-green-500 animate-pulse" : "bg-gray-300"
              }`}
            ></div>
            <span
              className={`font-medium ${
                isPlayingTTS
                  ? "text-green-500"
                  : isSpeaking
                  ? "text-green-500"
                  : hasSpokenInCurrentSession
                  ? "text-gray-500"
                  : "text-gray-500"
              }`}
            >
              {isPlayingTTS
                ? "AI応答中..."
                : isSpeaking
                ? "音声検出中..."
                : hasSpokenInCurrentSession
                ? "音声待機中..."
                : "話しかけてください..."}
            </span>
          </div>

          {/* Silence Timer */}
          {silenceTimer > 0 && (
            <div className="space-y-2">
              <div className="text-sm text-blue-600">
                送信まで: {Math.ceil((silenceDuration - silenceTimer) / 1000)}秒
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${silenceProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessing && (
            <div className="flex items-center justify-center gap-2">
              <LoadingSpinner size="sm" color="#3b82f6" />
              <span className="text-blue-500 font-medium">AI処理中...</span>
            </div>
          )}
        </div>
      )}

      {/* Interview Phase & Stats */}
      {isActive && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-blue-800">
              面接フェーズ: {getPhaseName(interviewPhase)}
            </h3>
            <span className="text-sm text-blue-600">
              やり取り: {Math.floor(conversationHistory.length / 2)}回
            </span>
          </div>
        </div>
      )}

      {/* Response and Error */}
      {response && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">
            面接官からの質問:
          </h3>
          <p className="text-green-700">{response}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-2">Error:</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
