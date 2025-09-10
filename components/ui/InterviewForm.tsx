"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { AuthModal } from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createInterview, verifyAuth } from "@/lib/actions/interview.actions";
import { canStartSession } from "@/lib/actions/usage.actions";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

const formSchema = z.object({
  name: z.string().optional(),

  education: z.string().optional(),

  companyName: z.string().min(1, {
    message: "会社名を入力してください",
  }),

  interviewFocus: z.enum(
    [
      "consulting",
      "finance",
      "manufacturing",
      "trading",
      "it",
      "advertising",
      "hr",
      "infrastructure",
      "real_estate",
    ],
    {
      required_error: "志望業界を選択してください",
    }
  ),
});

const interviewFocusOptions = [
  { value: "consulting", label: "コンサル" },
  { value: "finance", label: "金融" },
  { value: "manufacturing", label: "メーカー" },
  { value: "trading", label: "商社" },
  { value: "it", label: "IT・通信" },
  { value: "advertising", label: "広告・マスコミ" },
  { value: "hr", label: "人材" },
  { value: "infrastructure", label: "インフラ" },
  { value: "real_estate", label: "不動産・建設" },
] as const;

export function InterviewForm() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<z.infer<
    typeof formSchema
  > | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      education: "",
      companyName: "",
    },
  });

  // Handle authentication check and form submission
  useEffect(() => {
    if (!loading && user && pendingFormData) {
      // User just signed in and we have pending form data, proceed with submission
      setShowAuthModal(false); // Hide the modal
      handleAuthenticatedSubmit(pendingFormData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, user, pendingFormData]);

  // Remove Clerk-specific modal styling effects
  useEffect(() => {
    // No longer needed for Supabase auth
  }, [showAuthModal]);

  const handleAuthenticatedSubmit = async (
    values: z.infer<typeof formSchema>
  ) => {
    setIsSubmitting(true);
    try {
      // Double-check authentication before proceeding
      if (!user) {
        console.error("User not authenticated at submission time");
        setShowAuthModal(true);
        setIsSubmitting(false);
        return;
      }

      console.log("Client-side user ID:", user.id);
      console.log("Starting interview creation process...");

      // Check usage limits before creating interview
      const usageCheck = await canStartSession();

      if (!usageCheck.canStart) {
        // Redirect to billing page if usage limit exceeded
        router.push("/billing");
        return;
      }

      // Verify server-side authentication before proceeding
      const authCheck = await verifyAuth();
      console.log("Server-side auth check:", authCheck);
      if (!authCheck.isAuthenticated) {
        console.error(
          "Server-side authentication verification failed:",
          authCheck.error
        );
        console.error(
          "Client user ID:",
          user.id,
          "Server user ID:",
          authCheck.userId
        );

        // Try to refresh the session to sync client and server
        try {
          console.log(
            "Attempting to refresh session to sync authentication..."
          );
          const { supabase } = await import("@/lib/supabase/browser");

          // Force refresh the session to update cookies
          const { data: refreshData, error: refreshError } =
            await supabase.auth.refreshSession();

          if (refreshError) {
            console.error("Session refresh failed:", refreshError);
          } else {
            console.log(
              "Session refreshed successfully",
              refreshData.session?.user?.id
            );

            // Wait a moment for cookies to be set
            await new Promise((resolve) => setTimeout(resolve, 500));

            console.log("Retrying auth verification after session refresh...");
            const retryAuthCheck = await verifyAuth();
            console.log("Retry auth check result:", retryAuthCheck);

            if (retryAuthCheck.isAuthenticated) {
              console.log(
                "Authentication verified after session refresh, continuing..."
              );
              // Continue with the interview creation by not returning here
            } else {
              console.error(
                "Authentication still failed after session refresh"
              );
              setShowAuthModal(true);
              setIsSubmitting(false);
              return;
            }
          }
        } catch (refreshErr) {
          console.error("Error during session refresh:", refreshErr);
          setShowAuthModal(true);
          setIsSubmitting(false);
          return;
        }
      }

      // Call createInterview with new auth-tolerant handling
      const result = await createInterview(values);

      if (!result.ok) {
        if (result.code === "UNAUTHENTICATED") {
          console.error(
            "Authentication failed during interview creation despite verification"
          );
          console.error("This indicates a possible session/cookie sync issue");
          console.error(
            "Client user:",
            user?.id,
            "Server verification passed:",
            authCheck.isAuthenticated
          );
          setShowAuthModal(true);
          setIsSubmitting(false);
          return;
        } else if (result.code === "DB_ERROR") {
          console.error("Database error:", result.message);
          alert(
            `エラーが発生しました: ${result.message || "データベースエラー"}`
          );
          setIsSubmitting(false);
          return;
        } else if (result.code === "USAGE_LIMIT_EXCEEDED") {
          console.error("Usage limit exceeded");
          router.push("/billing");
          setIsSubmitting(false);
          return;
        }
      }

      // Success case
      if (result.ok && result.interview) {
        router.push(`/interview/${result.interview.id}`);
      } else {
        console.error("Unexpected response from createInterview");
        setIsSubmitting(false);
        router.push("/");
      }
    } catch (error) {
      console.error("Error creating interview:", error);
      // Show generic error message
      alert("面接の作成中にエラーが発生しました。もう一度お試しください。");
      setIsSubmitting(false);
    } finally {
      setPendingFormData(null);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Check if user is authenticated
    if (loading) {
      return; // Wait for auth to load
    }

    if (!user) {
      // Store form data and trigger authentication
      setPendingFormData(values);
      setShowAuthModal(true);
      return;
    }

    // User is already authenticated, proceed directly
    await handleAuthenticatedSubmit(values);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 sm:space-y-8"
        >
          {/* Personal Information Section */}
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#163300]">
              1. 個人情報
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-semibold text-[#163300]">
                      名前・ニックネーム
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="例: 田中太郎（任意）"
                        className="h-10 sm:h-12 text-sm sm:text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-semibold text-[#163300]">
                      学歴
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="例: 東京大学工学部卒業（任意）"
                        className="h-10 sm:h-12 text-sm sm:text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Job Information Section */}
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#163300]">
              2. 求人情報
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-semibold text-[#163300]">
                      会社名 <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="例: 株式会社〇〇（ない場合は「なし」と記入してください）"
                        className="h-10 sm:h-12 text-sm sm:text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interviewFocus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base font-semibold text-[#163300]">
                      志望業界 <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-10 sm:h-12 text-sm sm:text-base">
                          <SelectValue placeholder="志望する業界を選択してください" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {interviewFocusOptions.map((option) => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                            className="text-sm sm:text-base"
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs sm:text-sm">
                      選択した業界に特化した質問を含む面接練習を行います
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 sm:pt-5">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 sm:h-14 bg-[#9fe870] text-[#163300] hover:bg-[#8fd960] 
                  text-base sm:text-lg font-semibold rounded-full shadow-lg transition-colors cursor-pointer
                  disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" color="#163300" />
                  <span className="text-sm sm:text-base">面接を準備中...</span>
                </div>
              ) : (
                <span className="text-sm sm:text-base">
                  面接セッションを開始する
                </span>
              )}
            </Button>
          </div>
        </form>
      </Form>

      {/* Supabase Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="signin"
        onSuccess={() => {
          // Modal will close and useEffect will handle form submission
        }}
      />
    </div>
  );
}
