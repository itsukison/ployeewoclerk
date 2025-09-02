"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface UsageStatusWidgetProps {
  planName: string;
  remainingInterviews: number;
  remainingES: number;
  planLimitInterviews: number;
  planLimitES: number;
  currentUsageInterviews: number;
  currentUsageES: number;
  loading?: boolean;
}

export function UsageStatusWidget({
  planName,
  remainingInterviews,
  remainingES,
  planLimitInterviews,
  planLimitES,
  currentUsageInterviews,
  currentUsageES,
  loading = false
}: UsageStatusWidgetProps) {
  if (loading) {
    return (
      <Card className="bg-white/70 backdrop-blur-md border-0 shadow-lg rounded-2xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#f8fffe" }}
            >
              <TrendingUp className="h-4 w-4" style={{ color: "#163300" }} />
            </div>
            <span className="font-semibold text-sm text-black">
              使用状況
            </span>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-700">面接回数</span>
                <span className="text-xs font-semibold text-black">読み込み中...</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: "#163300",
                    width: "0%",
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium text-gray-700">ES添削回数</span>
                <span className="text-xs font-semibold text-black">読み込み中...</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: "#163300",
                    width: "0%",
                  }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Use the actual usage data passed from the dashboard
  const maxInterviews = planLimitInterviews;
  const maxES = planLimitES;
  const interviewsUsed = currentUsageInterviews;
  const esUsed = currentUsageES;

  // Calculate usage percentages based on actual data
  const interviewUsagePercentage = maxInterviews > 0 ? Math.min((interviewsUsed / maxInterviews) * 100, 100) : 0;
  const esUsagePercentage = maxES > 0 ? Math.min((esUsed / maxES) * 100, 100) : 0;

  return (
    <Card className="bg-white/70 backdrop-blur-md border-0 shadow-lg rounded-2xl">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#f8fffe" }}
          >
            <TrendingUp className="h-4 w-4" style={{ color: "#163300" }} />
          </div>
          <span className="font-semibold text-sm text-black">
            使用状況
          </span>
        </div>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">面接回数</span>
              <span className="text-xs font-semibold text-black">
                {maxInterviews >= 999 ? "無制限" : `${interviewsUsed} / ${maxInterviews}`}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: "#9fe870",
                  width: `${interviewUsagePercentage}%`,
                }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-700">ES添削回数</span>
              <span className="text-xs font-semibold text-black">
                {maxES >= 999 ? "無制限" : `${esUsed} / ${maxES}`}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: "#9fe870",
                  width: `${esUsagePercentage}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}