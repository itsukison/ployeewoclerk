"use client";

import React, { useEffect } from "react";
import Head from "next/head";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { CheckoutButton } from "@/components/payments/CheckoutButton";
import { PLANS } from "@/lib/stripe/plans";

export default function BillingPage() {
  useEffect(() => {
    document.title = "料金プラン | プロイー - AI面接練習プラットフォーム";

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "プロイーの料金プランをご確認ください。無料プランから始めて、AI面接練習で面接スキルを向上させましょう。"
      );
    }
  }, []);

  return (
    <ProtectedRoute>
      <Head>
        <title>料金プラン | プロイー - AI面接練習プラットフォーム</title>
        <meta
          name="description"
          content="プロイーの料金プランをご確認ください。無料プランから始めて、AI面接練習で面接スキルを向上させましょう。"
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              料金プラン
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-light">
              あなたの面接練習ニーズに合わせて最適なプランをお選びください
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">フリープラン</h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">¥0</div>
                <p className="text-gray-500">月額</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">面接練習 1回/月</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">ES添削 5回/月</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">基本的なフィードバック</span>
                </li>
              </ul>
              <button disabled className="w-full py-3 px-4 bg-gray-100 text-gray-400 rounded-lg font-semibold cursor-not-allowed">
                現在のプラン
              </button>
            </div>

            {/* Basic Plan */}
            <div className="bg-white rounded-2xl p-8 border-2 border-[#9fe870] hover:border-[#8fd960] transition-all relative">
              <div className="absolute top-4 right-4">
                <span className="bg-[#9fe870] text-[#163300] px-3 py-1 rounded-full text-sm font-semibold">
                  人気
                </span>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">ベーシックプラン</h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">¥{PLANS.basic.price.toLocaleString()}</div>
                <p className="text-gray-500">月額</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">面接練習 10回/月</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">ES添削 20回/月</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">詳細なフィードバック</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">業界別面接対策</span>
                </li>
              </ul>
              <CheckoutButton 
                planId="basic"
                planName={PLANS.basic.name}
                price={PLANS.basic.price}
              />
            </div>

            {/* Premium Plan */}
            <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">プレミアムプラン</h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">¥{PLANS.premium.price.toLocaleString()}</div>
                <p className="text-gray-500">月額</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">面接練習 20回/月</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">ES添削 50回/月</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">AI による詳細分析</span>
                </li>
                <li className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-600">優先サポート</span>
                </li>
              </ul>
              <CheckoutButton 
                planId="premium"
                planName={PLANS.premium.name}
                price={PLANS.premium.price}
              />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
