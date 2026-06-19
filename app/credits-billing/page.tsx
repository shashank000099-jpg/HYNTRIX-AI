'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../lib/auth-store'
import { supabaseClient } from '../../lib/supabase/client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Zap, ArrowLeft, CreditCard, Clock, ChevronRight, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface Transaction {
  id: string
  order_id: string
  payment_id: string | null
  amount: number
  credits: number
  currency: string
  status: 'pending' | 'success' | 'failed' | 'cancelled'
  error_message: string | null
  created_at: string
  updated_at: string
}

interface CreditHistoryEntry {
  id: string
  type: 'purchase' | 'usage'
  credits: number
  description: string | null
  feature_name: string | null
  created_at: string
}

export default function CreditsBillingPage() {
  const { user, initialized } = useAuthStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [creditHistory, setCreditHistory] = useState<CreditHistoryEntry[]>([])
  const [balance, setBalance] = useState({ remaining: 0, used: 0, total: 0 })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'history'>('overview')

  useEffect(() => {
    if (!initialized) return
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchBillingData()
  }, [user, initialized])

  async function fetchBillingData() {
    if (!user?.id || !supabaseClient) return
    setLoading(true)
    try {
      const { data: txs } = await supabaseClient
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)
      if (txs) setTransactions(txs)

      const { data: history } = await supabaseClient
        .from('credit_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)
      if (history) setCreditHistory(history)

      const { data: wallet } = await supabaseClient
        .from('credits')
        .select('remaining, used')
        .eq('user_id', user.id)
        .maybeSingle()
      if (wallet) {
        setBalance({
          remaining: wallet.remaining ?? 0,
          used: wallet.used ?? 0,
          total: (wallet.remaining ?? 0) + (wallet.used ?? 0),
        })
      }
    } catch (err) {
      console.error('Failed to fetch billing data:', err)
    } finally {
      setLoading(false)
    }
  }

  function getStatusBadge(status: string) {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      success: 'bg-green-500/10 text-green-400 border-green-500/20',
      failed: 'bg-red-500/10 text-red-400 border-red-500/20',
      cancelled: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    }
    return styles[status] || styles.pending
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'failed': return <XCircle className="h-4 w-4 text-red-400" />
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-slate-400" />
      default: return <Clock className="h-4 w-4 text-yellow-400" />
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!initialized || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  const TABS = [
    { id: 'overview' as const, label: 'Overview', icon: Zap },
    { id: 'transactions' as const, label: 'Transactions', icon: CreditCard },
    { id: 'history' as const, label: 'Credit History', icon: Clock },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div>
        <Link href="/profile" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Profile
        </Link>
        <h1 className="text-4xl font-semibold text-white">Credits & Billing</h1>
        <p className="mt-2 text-slate-400">Track your credits, payment history, and billing activity.</p>
      </div>

      {searchParams.get('payment') === 'success' && (
        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-center">
          <p className="text-green-400 font-semibold">Payment successful! Credits have been added to your account.</p>
        </div>
      )}
      {searchParams.get('payment') === 'failed' && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-center">
          <p className="text-red-400">Payment failed. Please try again or use a different payment method.</p>
        </div>
      )}
      {searchParams.get('payment') === 'cancelled' && (
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-center">
          <p className="text-yellow-400">Payment was cancelled. No charges were made.</p>
        </div>
      )}

      <div className="rounded-2xl border border-yellow-500/20 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-500/10">
              <Zap className="h-7 w-7 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-yellow-400">Current Balance</p>
              <p className="text-3xl font-bold text-white">{balance.remaining} Credits</p>
              <p className="text-xs text-slate-400 mt-1">{balance.used} used · {balance.total} total purchased</p>
            </div>
          </div>
          <Link href="/buy-credits" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition text-sm whitespace-nowrap">
            Buy Credits
          </Link>
        </div>
      </div>

      <div className="flex gap-1 rounded-2xl border border-white/10 bg-white/5 p-1">
        {TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          )
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Current Credits</p>
                  <p className="text-2xl font-bold text-white mt-1">{balance.remaining}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Credits Used</p>
                  <p className="text-2xl font-bold text-white mt-1">{balance.used}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Total Purchased</p>
                  <p className="text-2xl font-bold text-white mt-1">{balance.total}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Transactions</p>
                  <p className="text-2xl font-bold text-white mt-1">{transactions.length}</p>
                </div>
              </div>
              {transactions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
                  <div className="space-y-2">
                    {transactions.slice(0, 5).map((tx) => (
                      <Link key={tx.id} href={`/credits-billing/transaction/${tx.id}`}
                        className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.06] transition group">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(tx.status)}
                          <div>
                            <p className="text-sm font-medium text-white">₹{(tx.amount / 100).toFixed(2)} · {tx.credits} Credits</p>
                            <p className="text-xs text-slate-500">{formatDate(tx.created_at)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadge(tx.status)}`}>{tx.status}</span>
                          <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-white transition" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              {creditHistory.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-2">
                    {creditHistory.slice(0, 5).map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${entry.type === 'purchase' ? 'bg-green-500/10' : 'bg-blue-500/10'}`}>
                            <Zap className={`h-4 w-4 ${entry.type === 'purchase' ? 'text-green-400' : 'text-blue-400'}`} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{entry.type === 'purchase' ? '+' : ''}{entry.credits} Credits</p>
                            <p className="text-xs text-slate-500">{entry.description || entry.feature_name || entry.type}</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500">{formatDate(entry.created_at)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              {transactions.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                  <CreditCard className="h-10 w-10 text-slate-500 mx-auto mb-3" />
                  <p className="text-slate-400">No transactions yet</p>
                  <Link href="/buy-credits" className="mt-3 inline-block text-sm font-medium text-blue-400 hover:text-blue-300">Buy your first credits →</Link>
                </div>
              ) : (
                transactions.map((tx) => (
                  <Link key={tx.id} href={`/credits-billing/transaction/${tx.id}`}
                    className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/[0.06] transition group">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(tx.status)}
                      <div>
                        <p className="text-sm font-medium text-white">₹{(tx.amount / 100).toFixed(2)} · {tx.credits} Credits</p>
                        <p className="text-xs text-slate-500">{formatDate(tx.created_at)}</p>
                        {tx.payment_id && <p className="text-xs text-slate-600 font-mono">ID: {tx.payment_id.slice(0, 16)}...</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusBadge(tx.status)}`}>{tx.status}</span>
                      <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-white transition" />
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {creditHistory.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
                  <Clock className="h-10 w-10 text-slate-500 mx-auto mb-3" />
                  <p className="text-slate-400">No credit history yet</p>
                </div>
              ) : (
                creditHistory.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 ${entry.type === 'purchase' ? 'bg-green-500/10' : 'bg-blue-500/10'}`}>
                        <Zap className={`h-4 w-4 ${entry.type === 'purchase' ? 'text-green-400' : 'text-blue-400'}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-white">{entry.type === 'purchase' ? '+' : ''}{entry.credits} Credits</p>
                        <p className="text-xs text-slate-500 truncate">{entry.description || entry.feature_name || entry.type}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 flex-shrink-0 ml-4">{formatDate(entry.created_at)}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}