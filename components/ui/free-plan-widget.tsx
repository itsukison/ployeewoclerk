"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown, Star, Gift, Settings, ArrowRight } from "lucide-react";
import Link from "next/link";

interface FreePlanWidgetProps {
  planName: string;
  remainingInterviews: number;
  remainingES: number;
  loading?: boolean;
}

export function FreePlanWidget({ 
  planName, 
  remainingInterviews, 
  remainingES, 
  loading = false 
}: FreePlanWidgetProps) {
  const getPlanIcon = (planName: string) => {
    if (planName.includes("プレミアム")) {
      return <Crown className="h-4 w-4" />;
    } else if (planName.includes("ベーシック")) {
      return <Star className="h-4 w-4" />;
    } else {
      return <Gift className="h-4 w-4" />;
    }
  };

  const getPlanPrice = (planName: string) => {
    if (planName.includes("プレミアム")) {
      return "¥750/月";
    } else if (planName.includes("ベーシック")) {
      return "¥500/月";
    } else {
      return "無料";
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/70 backdrop-blur-md border-0 shadow-lg rounded-2xl">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#f8fffe" }}
            >
              <Gift className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-sm text-black">読み込み中...</div>
              <div className="text-xs text-gray-600">読み込み中...</div>
            </div>
            <Button variant="outline" size="sm" className="rounded-full px-2 py-1 text-xs" disabled>
              <Settings className="h-3 w-3 mr-1" />
              管理
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-center">
              <div className="font-semibold text-base text-black">-</div>
              <div className="text-gray-600 text-xs">面接回数</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-base text-black">-</div>
              <div className="text-gray-600 text-xs">ES添削回数</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/70 backdrop-blur-md border-0 shadow-lg rounded-2xl">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#f8fffe" }}
          >
            {getPlanIcon(planName)}
          </div>
          <div className="flex-1">
            <div className="font-semibold text-sm text-black">
              {planName}
            </div>
            <div className="text-xs text-gray-600">
              {getPlanPrice(planName)}
            </div>
          </div>
          <Link href="/billing">
            <Button variant="outline" size="sm" className="rounded-full px-2 py-1 text-xs">
              <Settings className="h-3 w-3 mr-1" />
              管理
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-center">
            <div className="font-semibold text-base text-black">
              {remainingInterviews === 999 || remainingInterviews > 50 ? "∞" : remainingInterviews}
            </div>
            <div className="text-gray-600 text-xs">面接回数</div>
            {remainingInterviews <= 0 && (
              <Link href="/billing">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="mt-2 bg-[#9fe870] text-[#163300] hover:bg-[#8fd960] rounded-full text-xs px-3 py-1 w-full"
                >
                  <span>もっと練習して、自信をつけよう！</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            )}
          </div>
          <div className="text-center">
            <div className="font-semibold text-base text-black">
              {remainingES === 999 || remainingES > 100 ? "∞" : remainingES}
            </div>
            <div className="text-gray-600 text-xs">ES添削回数</div>
            {remainingES <= 0 && (
              <Link href="/billing">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="mt-2 bg-[#9fe870] text-[#163300] hover:bg-[#8fd960] rounded-full text-xs px-3 py-1 w-full"
                >
                  <span>もっと添削してもらおう！</span>
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}