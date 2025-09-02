import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "2025年就活ブログ｜新卒面接対策・SPI攻略・GD完全ガイド",
  description:
    "2025年新卒就活に役立つ最新情報を配信。オンライン面接対策、SPI攻略法、グループディスカッション対策など、内定獲得に直結する実践的なアドバイスを提供。",
  keywords:
    "2025年就活, 新卒採用, 面接対策, SPI攻略, グループディスカッション, オンライン面接",
};

const blogPosts = [
  {
    slug: "2025-online-interview-topics",
    title: "【2025年最新】オンライン面接で必ず聞かれるTopics 7選",
    description:
      "2025年新卒就活では、オンライン面接が標準になりました。企業の75%以上がハイブリッド採用を導入する中で、必ず聞かれる面接Topicsを7つ厳選して解説します。",
    date: "2025年8月23日",
    readTime: "7分読む",
    image: "https://images.unsplash.com/photo-1598257006458-087169a1f08d",
    category: "面接対策",
    tags: ["オンライン面接", "2025年就活", "面接対策", "ハイブリッド採用"],
  },
  {
    slug: "spi-master-topics",
    title: "【2025年完全版】SPI攻略Topics｜就活生が1ヶ月でマスター",
    description:
      "2025年新卒採用でSPIは依然として最重要課題。企業の85%以上が導入しており、合格率はわずか25%。1ヶ月で確実に突破するSPI攻略Topicsを徹底解説。",
    date: "2025年8月23日",
    readTime: "8分読む",
    image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5",
    category: "適性検査",
    tags: ["SPI攻略", "適性検査", "勉強法", "2025年就活"],
  },
  {
    slug: "group-discussion-topics",
    title: "【2025年完全ガイド】GDで内定をもらうTopics 10選",
    description:
      "2025年新卒就活でグループディスカッションは重要な選考ステップ。GDで合格する確率はわずか25%。内定者が実践しているGD攻略Topicsを10選ご紹介。",
    date: "2025年8月23日",
    readTime: "9分読む",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    category: "グループディスカッション",
    tags: ["グループディスカッション", "GD攻略", "ケーススタディ"],
  },
];

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-200 pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-[#163300] transition-colors">
              ホーム
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">ブログ</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            就活ブログ
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed">
            面接対策、SPI攻略、グループディスカッションなど、就活に役立つ実践的なアドバイスを提供します。
          </p>
        </div>
      </header>

      {/* Blog Posts */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                      {post.category}
                    </span>
                    <span className="mx-3">•</span>
                    <time>{post.date}</time>
                    <span className="mx-3">•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-[#163300] transition-colors leading-tight">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {post.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-50 text-gray-600 px-2 py-1 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-[#163300] font-medium hover:text-[#9fe870] transition-colors"
                  >
                    記事を読む
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gray-50 rounded-lg p-8 mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            AI面接練習で実践的なスキルを身につけよう
          </h2>
          <p className="text-gray-600 mb-6">
            理論だけでなく、実際の面接練習で自信をつけませんか？
          </p>
          <Link
            href="/interview/new"
            className="inline-block px-6 py-3 bg-[#163300] text-white font-medium rounded-lg hover:bg-[#9fe870] hover:text-[#163300] transition-colors"
          >
            AI面接練習を始める
          </Link>
        </div>
      </main>
    </div>
  );
}
