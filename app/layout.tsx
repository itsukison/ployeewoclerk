import type { Metadata } from "next";
import Header from "@/components/ui/Header";
import ScrollRestoration from "@/components/ui/ScrollRestoration";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/components/auth/AuthProvider";
import "./globals.css";

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