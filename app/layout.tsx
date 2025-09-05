import type { Metadata } from "next";
import Header from "@/components/ui/Header";
import ScrollRestoration from "@/components/ui/ScrollRestoration";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

// Enhanced Structured Data for SEO and Rich Snippets
const structuredData = {
  "@context": "https://schema.org",
  "@type": ["WebApplication", "SoftwareApplication"],
  name: "プロイー",
  alternateName: "Ployee",
  url: "https://www.ployee.net",
  description:
    "AI面接官との実践練習で面接突破率を5倍向上。リアルタイム分析・個別フィードバック付き。就活生95%が「自信がついた」と評価。",
  applicationCategory: "EducationalApplication",
  applicationSubCategory: "面接練習アプリケーション",
  operatingSystem: "Web Browser",
  browserRequirements: "HTML5, JavaScript enabled",
  softwareVersion: "1.0",
  datePublished: "2024-01-01",
  dateModified: "2025-01-01",
  inLanguage: "ja-JP",
  isAccessibleForFree: true,
  usageInfo: "https://www.ployee.net/terms",
  privacyPolicy: "https://www.ployee.net/privacy",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "JPY",
    description: "無料プランでは3回まで面接練習が可能",
    availability: "https://schema.org/InStock",
    validFrom: "2024-01-01",
    eligibleRegion: {
      "@type": "Country",
      name: "日本",
    },
  },
  provider: {
    "@type": "Organization",
    name: "プロイー開発チーム",
    url: "https://www.ployee.net",
    logo: {
      "@type": "ImageObject",
      url: "https://www.ployee.net/logo.png",
    },
  },
  creator: {
    "@type": "Organization",
    name: "プロイー開発チーム",
  },
  keywords: [
    "AI面接練習",
    "面接対策",
    "AI面接官",
    "就活対策",
    "転職面接",
    "面接シミュレーション",
    "リアルタイム分析",
    "個別フィードバック",
  ],
  audience: {
    "@type": "Audience",
    audienceType: ["就活生", "転職希望者", "新卒採用対象者"],
    geographicArea: {
      "@type": "Country",
      name: "日本",
    },
  },
  featureList: [
    "AI面接官とのリアルタイム対話",
    "24時間いつでも練習可能",
    "詳細な分析とフィードバック",
    "個人最適化された改善提案",
    "ダウンロード可能な面接記録",
  ],
  screenshot: {
    "@type": "ImageObject",
    url: "https://www.ployee.net/screenshot.png",
    caption: "AI面接練習プラットフォームのスクリーンショット",
  },
  potentialAction: {
    "@type": "UseAction",
    name: "面接練習を始める",
    description: "AI面接官との実践的な面接練習を開始",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.ployee.net/interview/new",
      actionPlatform: [
        "http://schema.org/DesktopWebPlatform",
        "http://schema.org/MobileWebPlatform",
      ],
    },
    result: {
      "@type": "Thing",
      name: "面接スキルの向上",
    },
  },
  mainEntity: {
    "@type": "WebPage",
    "@id": "https://www.ployee.net/#webpage",
    url: "https://www.ployee.net",
    name: "AI面接練習プラットフォーム「プロイー」",
    description: "AI面接官との実践練習で面接突破率を5倍向上",
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: "https://www.ployee.net/og-image.jpg",
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".hero-subtitle"],
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "1247",
    bestRating: "5",
    worstRating: "1",
    description: "就活生からの高評価",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ployee.net"),
  title: "AI面接練習プラットフォーム「プロイー」| 24時間対応で内定率UP",
  description:
    "AI面接官との実践練習で面接突破率を5倍向上。リアルタイム分析・個別フィードバック付き。就活生95%が「自信がついた」と評価。無料体験3回まで。",
  keywords: [
    "AI面接練習",
    "面接対策 AI",
    "オンライン面接練習",
    "面接シミュレーション",
    "就活 面接対策",
    "転職 面接練習",
    "面接 フィードバック",
    "面接スキル向上",
    "面接不安解消",
    "24時間面接練習",
    "リアルタイム面接分析",
    "個別面接指導",
  ],
  authors: [{ name: "プロイー開発チーム" }],
  creator: "プロイー",
  publisher: "プロイー",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://www.ployee.net",
    title: "AI面接練習プラットフォーム「プロイー」| 24時間対応",
    description:
      "AI面接官との実践練習で面接突破率を5倍向上。リアルタイム分析・個別フィードバック付き。",
    siteName: "プロイー",
    images: [
      {
        url: "https://www.ployee.net/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "プロイー - AI面接練習プラットフォーム",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI面接練習プラットフォーム「プロイー」| 24時間対応",
    description:
      "AI面接官との実践練習で面接突破率を5倍向上。リアルタイム分析・個別フィードバック付き。",
    images: ["https://www.ployee.net/og-image.jpg"],
    creator: "@ployee_jp",
  },
  alternates: {
    canonical: "https://www.ployee.net",
    languages: {
      "ja-JP": "https://www.ployee.net",
      "x-default": "https://www.ployee.net",
    },
  },
  verification: {
    google: "XJ-vAmABbw4EGfp06PisjYYfdO8v6yxpo-BAIZv-OjM",
  },
  other: {
    "google-site-verification": "XJ-vAmABbw4EGfp06PisjYYfdO8v6yxpo-BAIZv-OjM",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {/* Fonts are loaded via app/head.tsx */}
          <ScrollRestoration />
          <Header />
          {children}
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
