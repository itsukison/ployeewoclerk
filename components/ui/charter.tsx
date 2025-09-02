"use client";

import { TrendingUp } from "lucide-react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Default data for Japanese interview criteria (can be overridden via props)
// Updated to match the API response format
const defaultChartData = [
  { criteria: "コミュニケーション力", score: 80 },
  { criteria: "論理的思考力", score: 75 },
  { criteria: "志望動機", score: 85 },
  { criteria: "自己分析力", score: 70 },
  { criteria: "成長意欲", score: 78 },
];

const chartConfig = {
  score: {
    label: "スコア",
    color: "#9fe870",
  },
} satisfies ChartConfig;

interface InterviewRadarChartProps {
  data?: Array<{ criteria: string; score: number }>;
  title?: string;
  description?: string;
  className?: string;
  frameless?: boolean;
}

export function InterviewRadarChart({
  data = defaultChartData,
  title = "評価基準",
  description = "面接での各項目の評価",
  className = "",
  frameless = false,
}: InterviewRadarChartProps) {
  if (frameless) {
    return (
      <div className={`${className}`}>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[450px] w-full"
        >
          <RadarChart data={data} margin={{ top: 20, right: 80, bottom: 20, left: 80 }}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis
              dataKey="criteria"
              tick={{ fontSize: 13, fill: "#6B7280", fontWeight: 500 }}
              className="text-sm"
              tickFormatter={(value) => {
                // Split long text into multiple lines if needed
                if (value.length > 8) {
                  const words = value.split('');
                  const mid = Math.ceil(words.length / 2);
                  return words.slice(0, mid).join('') + '\n' + words.slice(mid).join('');
                }
                return value;
              }}
            />
            <PolarGrid stroke="#E5E7EB" strokeWidth={1} />
            <Radar
              dataKey="score"
              stroke="#9fe870"
              fill="#9fe870"
              fillOpacity={0.25}
              strokeWidth={3}
              dot={{ fill: "#9fe870", strokeWidth: 3, r: 4 }}
            />
          </RadarChart>
        </ChartContainer>
      </div>
    );
  }

  return (
    <Card className={`border-gray-100 shadow-sm ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-[#163300]">
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[220px]"
        >
          <RadarChart data={data} margin={{ top: 20, right: 60, bottom: 20, left: 60 }}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis
              dataKey="criteria"
              tick={{ fontSize: 12, fill: "#6B7280" }}
              className="text-xs"
              tickFormatter={(value) => {
                // Split long text into multiple lines if needed
                if (value.length > 8) {
                  const words = value.split('');
                  const mid = Math.ceil(words.length / 2);
                  return words.slice(0, mid).join('') + '\n' + words.slice(mid).join('');
                }
                return value;
              }}
            />
            <PolarGrid stroke="#E5E7EB" />
            <Radar
              dataKey="score"
              stroke="#9fe870"
              fill="#9fe870"
              fillOpacity={0.2}
              strokeWidth={2}
              dot={{ fill: "#9fe870", strokeWidth: 2, r: 3 }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// Keep the original export for backward compatibility
export function ChartRadarDefault() {
  return <InterviewRadarChart />;
}