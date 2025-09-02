"use client";

import React from "react";

interface InterviewInfoProps {
  currentUserTranscript: string;
  fullTranscript: string;
  conversationHistory: Array<{
    role: "user" | "assistant";
    content: string;
    timestamp: number;
  }>;
  silenceDuration: number;
  onDownloadTranscript: () => void;
}

export default function InterviewInfo({
  currentUserTranscript,
  fullTranscript,
  conversationHistory,
  silenceDuration,
  onDownloadTranscript,
}: InterviewInfoProps) {
  return (
    <div className="space-y-6">
      {/* Current User Transcript */}
      {currentUserTranscript && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">あなたの発言:</h3>
          <p className="text-yellow-700 text-sm">{currentUserTranscript}</p>
        </div>
      )}

      {/* Transcript Download */}
      {fullTranscript && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-purple-800">
              面接記録 ({Math.floor(conversationHistory.length / 2)}
              回のやり取り)
            </h3>
            <button
              onClick={onDownloadTranscript}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              記録をダウンロード
            </button>
          </div>
          <div className="mt-2 max-h-32 overflow-y-auto text-sm text-purple-700 whitespace-pre-wrap">
            {fullTranscript}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">
          面接システムの使い方:
        </h3>
        <ul className="text-blue-700 space-y-1 ml-4">
          <li>• 「会話開始」をクリックして面接を開始</li>
          <li>• 面接官が積極的に質問を投げかけます</li>
          <li>
            • {silenceDuration / 1000}
            秒間静かにすると自動的に次の質問が来ます
          </li>
          <li>• 自己紹介→経歴→スキル→志望動機→質疑応答の順で進みます</li>
          <li>• 具体的なエピソードや例を交えて回答してください</li>
          <li>• 浅い回答の場合は面接官が深掘り質問をします</li>
          <li>• 「会話終了」で面接を終了</li>
        </ul>
      </div>
    </div>
  );
}
