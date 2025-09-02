"use client";

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { SignInForm } from './SignInForm'
import { SignUpForm } from './SignUpForm'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'signin' | 'signup'
  onSuccess?: () => void
  redirectTo?: string
}

export function AuthModal({ 
  isOpen, 
  onClose, 
  initialMode = 'signin', 
  onSuccess,
  redirectTo = '/dashboard'
}: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)

  // Reset mode when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode)
    }
  }, [isOpen, initialMode])

  const handleSuccess = () => {
    onSuccess?.()
    onClose()
  }

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-6">
        <DialogHeader className="text-center space-y-2 mb-6">
          <DialogTitle className="text-2xl font-bold text-[#163300]">
            {mode === 'signin' ? 'ログイン' : '新規登録'}
          </DialogTitle>
          <p className="text-gray-600">
            {mode === 'signin' 
              ? 'アカウントにサインインしてください'
              : '新しいアカウントを作成してください'
            }
          </p>
        </DialogHeader>

        {mode === 'signin' ? (
          <SignInForm onSuccess={handleSuccess} redirectTo={redirectTo} />
        ) : (
          <SignUpForm onSuccess={handleSuccess} redirectTo={redirectTo} />
        )}

        <div className="mt-6 text-center">
          <button
            onClick={toggleMode}
            className="text-sm text-[#163300] hover:underline"
          >
            {mode === 'signin' 
              ? 'アカウントをお持ちでない方はこちら' 
              : 'すでにアカウントをお持ちの方はこちら'
            }
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}