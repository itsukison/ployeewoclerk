"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { AuthModal } from "@/components/auth/AuthModal";

interface AutoSignInProps {
  children: React.ReactNode;
  nonClosableModal?: boolean; // New prop to make modal non-closable
}

const AutoSignIn = ({
  children,
  nonClosableModal = false,
}: AutoSignInProps) => {
  const { user, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Only show modal if Supabase has loaded, user is not signed in, and modal isn't already showing
    if (!loading && !user && !showModal) {
      setShowModal(true);
    }
  }, [loading, user, showModal]);

  // Show a loading state while determining auth status
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

  // If user is signed in, show the actual page content
  if (user) {
    return <>{children}</>;
  }

  // Show loading state with auth modal
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="md" color="#9fe870" />
        <p className="text-gray-600">認証中...</p>
      </div>
      
      <AuthModal
        isOpen={showModal}
        onClose={() => {
          if (!nonClosableModal) {
            setShowModal(false);
          }
        }}
        initialMode="signin"
      />
    </div>
  );
};

export default AutoSignIn;
