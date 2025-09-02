"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { gsap } from "gsap";
import logo from "../../constants/logo.png";
import { useAuth } from "@/components/auth/AuthProvider";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings } from "lucide-react";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Check if current page is home page
  const isHomePage = pathname === "/";

  // Refs for header animations
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Header animations on page load
    if (
      headerRef.current &&
      logoRef.current &&
      navRef.current &&
      buttonsRef.current
    ) {
      // Set initial states
      gsap.set([logoRef.current, navRef.current, buttonsRef.current], {
        opacity: 0,
        y: -20,
      });

      // Create timeline for staggered animation
      const tl = gsap.timeline();

      // Animate logo first
      tl.to(logoRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      })
        // Then animate navigation links
        .to(
          navRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        ) // Start slightly before logo animation ends
        // Finally animate buttons
        .to(
          buttonsRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3"
        ); // Start slightly before nav animation ends
    }

    // Scroll detection for enhanced glass effect
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside or on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header
      ref={headerRef}
      className={`z-50 transition-all duration-300 ${
        isHomePage
          ? "sticky top-5 mx-4 sm:mx-8 lg:mx-16"
          : "sticky top-0 w-full"
      }`}
    >
      {/* Conditional Container Styling */}
      <div
        className={`
          transition-all duration-300 ease-out h-16
          ${
            isHomePage
              ? `backdrop-blur-lg bg-white/30 border border-white/30 rounded-[32px] shadow-lg ${
                  isScrolled
                    ? "bg-white/30 shadow-xl border-white/40"
                    : "bg-white/30 shadow-lg"
                }`
              : "bg-white border-b border-gray-200"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            {/* Left: Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div
                ref={logoRef}
                className="cursor-pointer flex items-center space-x-3"
                onClick={() => router.push(user ? "/dashboard" : "/")}
              >
                <Image
                  src={logo}
                  alt="プロイー ロゴ"
                  width={32}
                  height={32}
                  className="object-contain"
                />
                <h1 className="text-xl sm:text-2xl -ml-2 font-bold text-[#163300]">
                  プロイー
                </h1>
              </div>

              {/* Desktop Navigation Links */}
              <nav
                ref={navRef}
                className="hidden lg:flex items-center space-x-6"
              >
                <Link
                  href="/"
                  className="text-[#163300] hover:text-[#9fe870] transition-colors font-medium"
                >
                  ホーム
                </Link>
                <Link
                  href="/interview/new"
                  className="text-[#163300] hover:text-[#9fe870] transition-colors font-medium"
                >
                  練習
                </Link>
                <Link
                  href="/pricing"
                  className="text-[#163300] hover:text-[#9fe870] transition-colors font-medium"
                >
                  料金
                </Link>
                <Link
                  href="/past"
                  className="text-[#163300] hover:text-[#9fe870] transition-colors font-medium"
                >
                  面接履歴
                </Link>
              </nav>
            </div>

            {/* Right: Auth Buttons and Mobile Menu */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Desktop Auth Buttons */}
              <div
                ref={buttonsRef}
                className="hidden sm:flex items-center space-x-4"
              >
                {!user ? (
                  <>
                    <button 
                      onClick={() => {
                        setAuthMode('signin');
                        setShowAuthModal(true);
                      }}
                      className="text-[#163300] hover:text-[#9fe870] transition-colors font-medium"
                    >
                      ログイン
                    </button>
                    <button 
                      onClick={() => {
                        setAuthMode('signup');
                        setShowAuthModal(true);
                      }}
                      className="bg-[#9fe870] text-[#163300] px-4 lg:px-6 py-2 rounded-full font-medium hover:bg-[#8fd960] transition-colors shadow-sm text-sm lg:text-base"
                    >
                      無料で始める
                    </button>
                  </>
                ) : (
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                      <div className="w-8 h-8 bg-[#9fe870] rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-[#163300]" />
                      </div>
                    </button>
                    
                    {showUserMenu && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user.email}</p>
                        </div>
                        <button
                          onClick={() => {
                            router.push('/dashboard');
                            setShowUserMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                        >
                          <Settings className="w-4 h-4" />
                          <span>ダッシュボード</span>
                        </button>
                        <button
                          onClick={async () => {
                            await signOut();
                            setShowUserMenu(false);
                            router.push('/');
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>ログアウト</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 rounded-md text-[#163300] hover:text-[#9fe870] hover:bg-white/20 transition-colors"
                aria-label="メニューを開く"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 z-50 mt-2 mx-4 sm:mx-8 lg:mx-16">
            <div
              className={`
                rounded-2xl shadow-lg border backdrop-blur-lg overflow-hidden
                ${
                  isHomePage
                    ? "bg-white/90 border-white/30"
                    : "bg-white border-gray-200"
                }
              `}
            >
              <div className="px-4 py-2">
                {/* Mobile Navigation Links */}
                <nav className="space-y-1">
                  <Link
                    href="/"
                    className="block px-4 py-3 text-[#163300] hover:text-[#9fe870] hover:bg-gray-50/50 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ホーム
                  </Link>
                  <Link
                    href="/interview/new"
                    className="block px-4 py-3 text-[#163300] hover:text-[#9fe870] hover:bg-gray-50/50 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    練習
                  </Link>
                  <Link
                    href="/pricing"
                    className="block px-4 py-3 text-[#163300] hover:text-[#9fe870] hover:bg-gray-50/50 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    料金
                  </Link>
                  <Link
                    href="/past"
                    className="block px-4 py-3 text-[#163300] hover:text-[#9fe870] hover:bg-gray-50/50 rounded-lg transition-colors font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    面接履歴
                  </Link>
                </nav>

                {/* Mobile Auth Buttons */}
                <div className="mt-4 pt-4 border-t border-gray-200/50 space-y-3">
                  {!user ? (
                    <>
                      <button 
                        onClick={() => {
                          setAuthMode('signin');
                          setShowAuthModal(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-[#163300] hover:text-[#9fe870] hover:bg-gray-50/50 rounded-lg transition-colors font-medium"
                      >
                        ログイン
                      </button>
                      <button 
                        onClick={() => {
                          setAuthMode('signup');
                          setShowAuthModal(true);
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full bg-[#9fe870] text-[#163300] px-4 py-3 rounded-lg font-medium hover:bg-[#8fd960] transition-colors shadow-sm"
                      >
                        無料で始める
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          router.push('/dashboard');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-[#163300] hover:bg-gray-50/50 rounded-lg transition-colors font-medium flex items-center space-x-2"
                      >
                        <Settings className="w-4 h-4" />
                        <span>ダッシュボード</span>
                      </button>
                      <button
                        onClick={async () => {
                          await signOut();
                          setIsMobileMenuOpen(false);
                          router.push('/');
                        }}
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50/50 rounded-lg transition-colors font-medium flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>ログアウト</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#163300] mb-2">
                {authMode === 'signin' ? 'ログイン' : 'アカウント作成'}
              </h2>
              <p className="text-gray-600">
                {authMode === 'signin' 
                  ? 'アカウントにサインインしてください' 
                  : '新しいアカウントを作成してください'
                }
              </p>
            </div>
            
            {authMode === 'signin' ? (
              <SignInForm onSuccess={() => setShowAuthModal(false)} />
            ) : (
              <SignUpForm onSuccess={() => setShowAuthModal(false)} />
            )}
            
            <div className="mt-4 text-center">
              <button
                onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                className="text-sm text-[#163300] hover:underline"
              >
                {authMode === 'signin' 
                  ? 'アカウントをお持ちでない方はこちら' 
                  : '既にアカウントをお持ちの方はこちら'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
