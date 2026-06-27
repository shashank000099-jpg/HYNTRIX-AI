'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabaseClient } from '../../../lib/supabase/client'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

const signupSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
})

type SignupForm = z.infer<typeof signupSchema>

const AUTH_UNAVAILABLE = 'Authentication is temporarily unavailable. Please try again later.'
const EXISTING_ACCOUNT = 'An account with this email already exists. Please sign in instead.'

function getSignupErrorMessage(error: { message?: string } | null | undefined) {
  const message = error?.message?.toLowerCase() || ''

  if (message.includes('already') || message.includes('registered') || message.includes('exists')) {
    return EXISTING_ACCOUNT
  }

  if (message.includes('password')) {
    return 'Please use a stronger password.'
  }

  if (message.includes('rate') || message.includes('too many')) {
    return 'Too many attempts. Please wait a moment and try again.'
  }

  return 'Could not create your account. Please try again.'
}

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema)
  })

  const onSubmit = async (data: SignupForm) => {
    if (!supabaseClient) {
      setError(AUTH_UNAVAILABLE)
      return
    }

    try {
      setLoading(true)
      setError('')
      
      const { error: signUpError, data: authData } = await supabaseClient.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`
        }
      })

      if (signUpError) {
        console.error('Signup error:', { message: signUpError.message, code: signUpError.code, status: signUpError.status })
        setError(getSignupErrorMessage(signUpError))
        return
      }

      if (authData.user && Array.isArray(authData.user.identities) && authData.user.identities.length === 0) {
        setError(EXISTING_ACCOUNT)
        return
      }

      if (authData.user) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/auth/login?verified=check-email')
        }, 2000)
      }
    } catch (err: any) {
      console.error('Signup catch error:', err)
      setError('Could not create your account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    if (!supabaseClient) {
      setError(AUTH_UNAVAILABLE)
      return
    }

    try {
      setGoogleLoading(true)
      setError('')
      
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`
        }
      })

      if (error) {
        console.error('Google sign up error:', { message: error.message, code: error.code, status: error.status })
        setError('Google sign up could not be started. Please try again.')
      }
    } catch (err: any) {
      console.error('Google sign up catch error:', err)
      setError('Google sign up could not be started. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-8">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40">
                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
            <p className="text-gray-400 mb-4">Check your email to verify your account</p>
            <p className="text-sm text-gray-500">Redirecting you to sign in...</p>
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
          <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400 text-sm mb-8">Get started in seconds</p>

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

            <div>
              <label className="block text-sm font-medium text-white mb-2">Password</label>
              <Input type="password" placeholder="••••••••" {...register('password')} error={!!errors.password} />
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
              <Input type="password" placeholder="••••••••" {...register('confirmPassword')} error={!!errors.confirmPassword} />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-gray-500">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-medium transition disabled:opacity-50"
          >
            {googleLoading ? 'Creating account...' : 'Sign Up with Google'}
          </button>

          <div className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 font-medium">
              Sign In
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-8">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
