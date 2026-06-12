'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabaseClient } from '../../../lib/supabase/client'

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'already'>('verifying')
  const [message, setMessage] = useState('')

  useEffect(() => {
    async function verifyEmail() {
      const email = searchParams.get('email')

      if (!supabaseClient) {
        setStatus('error')
        setMessage('Supabase not configured')
        return
      }

      try {
        // Check if user is already authenticated (session exists)
        const { data: { session } } = await supabaseClient.auth.getSession()
        
        if (session?.user) {
          // Check if email is confirmed
          if (session.user.email_confirmed_at) {
            setStatus('success')
            setMessage('Email verified successfully!')
            setTimeout(() => router.push('/dashboard'), 2000)
            return
          }
        }

        // If no session, check by URL hash or query params
        // Supabase typically passes type=signup&token_hash=xxx in URL
        const type = searchParams.get('type')
        const token_hash = searchParams.get('token_hash')

        if (type && token_hash) {
          const { error } = await supabaseClient.auth.verifyOtp({
            type: 'signup',
            token_hash,
          })

          if (error) {
            if (error.message.includes('expired')) {
              setStatus('error')
              setMessage('This verification link has expired. Please sign up again.')
              return
            }
            if (error.message.includes('already verified')) {
              setStatus('already')
              setMessage('Your email is already verified!')
              setTimeout(() => router.push('/auth/login'), 1500)
              return
            }
            setStatus('error')
            setMessage('Invalid verification link. Please try signing up again.')
            return
          }
          
          setStatus('success')
          setMessage('Email verified successfully! Redirecting to dashboard...')
          setTimeout(() => router.push('/dashboard'), 2000)
          return
        }

        // If we have email but no token, user may have already been redirected
        if (email && !token_hash) {
          // Try to refresh session
          const { data: { user } } = await supabaseClient.auth.getUser()
          if (user?.email_confirmed_at) {
            setStatus('success')
            setMessage('Email already verified!')
            setTimeout(() => router.push('/dashboard'), 1500)
            return
          }
        }

        setStatus('error')
        setMessage('Invalid verification link. Please try signing up again.')
      } catch (err) {
        setStatus('error')
        setMessage('Something went wrong. Please try again.')
      }
    }

    verifyEmail()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Hyntrix AI</h1>
          <p className="text-gray-400">Email Verification</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-8 text-center">
          {status === 'verifying' && (
            <div className="space-y-4">
              <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
              <h2 className="text-xl font-bold text-white">Verifying your email...</h2>
              <p className="text-gray-400 text-sm">Please wait while we confirm your email address.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">{message}</h2>
              <p className="text-gray-400 text-sm">Taking you to your dashboard...</p>
            </div>
          )}

          {status === 'already' && (
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/40">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">{message}</h2>
              <p className="text-gray-400 text-sm">Redirecting to login...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white">Verification Failed</h2>
              <p className="text-gray-400 text-sm">{message}</p>
              <div className="mt-6 space-y-3">
                <a
                  href="/auth/signup"
                  className="block w-full px-4 py-2.5 rounded-xl bg-blue-500/20 border border-blue-500/30 text-sm font-medium text-blue-300 hover:bg-blue-500/30 transition"
                >
                  Sign Up Again
                </a>
                <a
                  href="/auth/login"
                  className="block w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white hover:bg-white/10 transition"
                >
                  Go to Login
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  )
}