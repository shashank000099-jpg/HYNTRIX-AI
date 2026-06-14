'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabaseClient } from '../../../lib/supabase/client'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  })

  useEffect(() => {
    if (searchParams.get('verified') === 'check-email') {
      setSuccessMessage('Account created! Check your email for the verification link, then sign in.')
    }
    if (searchParams.get('message')) {
      setSuccessMessage(searchParams.get('message')!)
    }
  }, [searchParams])

  const onSubmit = async (data: LoginForm) => {
    if (!supabaseClient) {
      setError('Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccessMessage('')
      
      const { error: signInError, data: authData } = await supabaseClient.auth.signInWithPassword({
        email: data.email,
        password: data.password
      })

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.')
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Please verify your email before signing in. Check your inbox for the verification link.')
        } else {
          setError(`Login failed: ${signInError.message}`)
        }
        return
      }

      if (authData.user) {
        // Check if onboarding is needed
        const { data: userData } = await supabaseClient
          .from('users')
          .select('name, goal')
          .eq('id', authData.user.id)
          .maybeSingle()

        if (!userData?.name || !userData?.goal) {
          router.push('/onboarding')
        } else {
          router.push('/')
        }
      }
    } catch (err: any) {
      console.error('Login error:', err)
      setError(`Connection error: ${err?.message || 'Please try again later.'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    if (!supabaseClient) {
      setError('Supabase not configured. Check environment variables.')
      return
    }

    try {
      setGoogleLoading(true)
      setError('')
      
      const { error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        setError(`Google sign in failed: ${error.message}`)
      }
    } catch (err: any) {
      console.error('Google sign in error:', err)
      setError(`Google sign in error: ${err?.message || 'Please try again.'}`)
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-white mb-2 hover:text-blue-400 transition">Hyntrix AI</h1>
          </Link>
          <p className="text-gray-400">Your AI Founder Operating System</p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
          <p className="text-gray-400 text-sm mb-8">Enter your details to continue</p>

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <p className="text-green-400 text-sm">{successMessage}</p>
            </div>
          )}

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

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
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
            {googleLoading ? 'Signing in...' : 'Continue with Google'}
          </button>

          <div className="mt-8 space-y-3 text-center text-sm">
            <div>
              <Link href="/auth/forgot-password" className="text-blue-400 hover:text-blue-300">
                Forgot your password?
              </Link>
            </div>
            <div className="text-gray-400">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-blue-400 hover:text-blue-300 font-medium">
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-gray-600 mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}