"use client";

import { useAuth } from "./AuthProvider";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

const ProtectedRoute = ({
  children,
  requireAuth = true,
  redirectTo = "/dashboard",
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    if (!loading && requireAuth && !user) {
      setShowAuthModal(true);
    }
  }, [loading, requireAuth, user]);

  // Show loading state while determining auth status
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="md" color="#9fe870" />
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  // If auth is required but user is not signed in, show auth modal
  if (requireAuth && !user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="md" color="#9fe870" />
          <p className="text-gray-600">認証中...</p>
        </div>

        {/* Authentication Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
              {/* Non-closable modal for protected routes - no close button */}
              
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#163300] mb-2">
                  {authMode === 'signin' ? 'ログイン' : 'アカウント作成'}
                </h2>
                <p className="text-gray-600">
                  {authMode === 'signin' 
                    ? 'このページにアクセスするにはログインが必要です' 
                    : '新しいアカウントを作成してください'
                  }
                </p>
              </div>
              
              {authMode === 'signin' ? (
                <SignInForm 
                  onSuccess={() => setShowAuthModal(false)} 
                  redirectTo={redirectTo}
                />
              ) : (
                <SignUpForm 
                  onSuccess={() => setShowAuthModal(false)}
                  redirectTo={redirectTo}
                />
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
      </div>
    );
  }

  // If user is signed in or auth is not required, show the actual page content
  return <>{children}</>;
};

export default ProtectedRoute;