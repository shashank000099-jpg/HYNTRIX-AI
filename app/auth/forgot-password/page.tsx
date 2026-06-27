'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabaseClient } from '../../../lib/supabase/client'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email')
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

const AUTH_UNAVAILABLE = 'Authentication is temporarily unavailable. Please try again later.'

export default function ForgotPasswordPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema)
  })

  const onSubmit = async (data: ForgotPasswordForm) => {
    if (!supabaseClient) {
      setError(AUTH_UNAVAILABLE)
      return
    }

    try {
      setLoading(true)
      setError('')
      
      const { error: resetError } = await supabaseClient.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/reset-password`
      })

      if (resetError) {
        console.error('Password reset error:', { message: resetError.message, code: resetError.code, status: resetError.status })
        setError('Could not send the reset link. Please try again.')
        return
      }

      setSuccess(true)
    } catch (err: any) {
      console.error('Password reset catch error:', err)
      setError('Could not send the reset link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-8">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 border border-blue-500/40">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Email Sent!</h2>
            <p className="text-gray-400 mb-6">Check your email for a link to reset your password</p>
            <Link href="/auth/login" className="inline-block text-blue-400 hover:text-blue-300 font-medium">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Hyntrix AI</h1>
          <p className="text-gray-400">Your AI Founder Operating System</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-2">Forgot Password?</h2>
          <p className="text-gray-400 text-sm mb-8">Enter your email and we&apos;ll send you a link to reset it</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Email</label>
              <Input type="email" placeholder="you@example.com" {...register('email')} error={!!errors.email} />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          <div className="mt-8 space-y-3 text-center text-sm">
            <div className="text-gray-400">
              Remember your password?{' '}
              <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign In
              </Link>
            </div>
            <div className="text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
