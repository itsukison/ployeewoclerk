"use client";

import { FreePlanWidget } from "./free-plan-widget";
import { UsageStatusWidget } from "./usage-status-widget";

interface PlanAndUsageWidgetsProps {
  planName: string;
  remainingInterviews: number;
  remainingES: number;
  planLimitInterviews: number;
  planLimitES: number;
  currentUsageInterviews: number;
  currentUsageES: number;
  loading?: boolean;
}

export function PlanAndUsageWidgets({
  planName,
  remainingInterviews,
  remainingES,
  planLimitInterviews,
  planLimitES,
  currentUsageInterviews,
  currentUsageES,
  loading = false
}: PlanAndUsageWidgetsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Free Plan Widget */}
      <FreePlanWidget 
        planName={planName}
        remainingInterviews={remainingInterviews}
        remainingES={remainingES}
        loading={loading} 
      />

      {/* Usage Status Widget */}
      <UsageStatusWidget
        planName={planName}
        remainingInterviews={remainingInterviews}
        remainingES={remainingES}
        planLimitInterviews={planLimitInterviews}
        planLimitES={planLimitES}
        currentUsageInterviews={currentUsageInterviews}
        currentUsageES={currentUsageES}
        loading={loading}
      />
    </div>
  );
}