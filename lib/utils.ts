import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculate session duration in minutes from start and end timestamps
 * @param startTime - session start timestamp
 * @param endTime - session end timestamp  
 * @returns duration in minutes (rounded up)
 */
export function calculateSessionMinutes(startTime: Date, endTime: Date): number {
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationMinutes = durationMs / (1000 * 60);
  return Math.ceil(durationMinutes); // Round up to nearest minute
}

/**
 * Redirect user to the billing/pricing page
 */
export function redirectToPricing(): void {
  if (typeof window !== "undefined") {
    window.location.href = "/billing";
  }
}

/**
 * Check if user has exceeded their monthly usage limit
 * @param currentUsage - current minutes used this month
 * @param planLimit - user's plan limit in minutes
 * @returns true if usage limit is exceeded
 */
export function checkUsageLimitExceeded(currentUsage: number, planLimit: number): boolean {
  return currentUsage >= planLimit;
}
