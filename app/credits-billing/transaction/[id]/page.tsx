'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '../../../../lib/auth-store'
import { supabaseClient } from '../../../../lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, Clock, Copy } from 'lucide-react'
import Link from 'next/link'

interface PaymentTransaction {
  id: string
  user_id: string
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

export default function TransactionDetailPage() {
  const { user, initialized } = useAuthStore()
  const router = useRouter()
  const params = useParams()
  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null)
  const [creditHistory, setCreditHistory] = useState<CreditHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    if (!initialized) return
    if (!user) {
      router.push('/auth/login')
      return
    }
    fetchTransaction()
  }, [user, initialized, params.id])

  async function fetchTransaction() {
    if (!user?.id || !supabaseClient || !params.id) return
    setLoading(true)
    try {
      const { data: tx } = await supabaseClient
        .from('transactions')
        .select('*')
        .eq('id', params.id)
        .eq('user_id', user.id)
        .maybeSingle()
      if (tx) setTransaction(tx)

      const { data: ch } = await supabaseClient
        .from('credit_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)
      if (ch) setCreditHistory(ch)
    } catch (err) {
      console.error('Failed to fetch transaction:', err)
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  function getStatusDisplay(status: string) {
    const styles: Record<string, { icon: any; color: string; text: string; bg: string }> = {
      pending: { icon: Clock, color: 'text-yellow-400', text: 'Pending', bg: 'bg-yellow-500/10' },
      success: { icon: CheckCircle, color: 'text-green-400', text: 'Success', bg: 'bg-green-500/10' },
      failed: { icon: XCircle, color: 'text-red-400', text: 'Failed', bg: 'bg-red-500/10' },
      cancelled: { icon: AlertCircle, color: 'text-slate-400', text: 'Cancelled', bg: 'bg-slate-500/10' },
    }
    return styles[status] || styles.pending
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    })
  }

  if (!initialized || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 pt-20">
        <Link href="/credits-billing" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
          <ArrowLeft className="h-4 w-4" /> Back to Billing
        </Link>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-slate-400">Transaction not found</p>
        </div>
      </div>
    )
  }

  const statusDisplay = getStatusDisplay(transaction.status)
  const StatusIcon = statusDisplay.icon

  const DETAILS = [
    { label: 'Transaction ID', value: transaction.id },
    { label: 'Order ID', value: transaction.order_id },
    { label: 'Payment ID', value: transaction.payment_id || 'N/A' },
    { label: 'Amount', value: `₹${(transaction.amount / 100).toFixed(2)}` },
    { label: 'Credits', value: `${transaction.credits} Credits` },
    { label: 'Currency', value: transaction.currency },
    { label: 'Created', value: formatDate(transaction.created_at) },
    { label: 'Updated', value: formatDate(transaction.updated_at) },
  ]
  if (transaction.error_message) DETAILS.push({ label: 'Error', value: transaction.error_message })

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <Link href="/credits-billing" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
        <ArrowLeft className="h-4 w-4" /> Back to Billing
      </Link>

      <div className={`rounded-2xl border ${statusDisplay.bg} ${statusDisplay.color.replace('text-', 'border-').replace('400', '500/20')} p-6 md:p-8`}>
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-xl ${statusDisplay.bg} flex items-center justify-center`}>
            <StatusIcon className={`h-6 w-6 ${statusDisplay.color}`} />
          </div>
          <div>
            <p className={`text-lg font-semibold ${statusDisplay.color}`}>{statusDisplay.text}</p>
            <p className="text-2xl font-bold text-white mt-1">₹{(transaction.amount / 100).toFixed(2)} · {transaction.credits} Credits</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
        <h3 className="text-lg font-semibold text-white mb-6">Transaction Details</h3>
        <div className="space-y-1">
          {DETAILS.map((detail) => (
            <div key={detail.label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
              <span className="text-sm text-slate-400">{detail.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-white font-mono text-right max-w-[200px] truncate">{detail.value}</span>
                {(detail.label === 'Transaction ID' || detail.label === 'Order ID' || detail.label === 'Payment ID') && detail.value !== 'N/A' && (
                  <button onClick={() => copyToClipboard(detail.value, detail.label)} className="text-slate-500 hover:text-white transition flex-shrink-0" title="Copy to clipboard">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {creditHistory.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <h3 className="text-lg font-semibold text-white mb-4">Related Credit Activity</h3>
          <div className="space-y-2">
            {creditHistory.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${entry.type === 'purchase' ? 'bg-green-500/10' : 'bg-blue-500/10'}`}>
                    <span className={`text-sm font-bold ${entry.type === 'purchase' ? 'text-green-400' : 'text-blue-400'}`}>
                      {entry.type === 'purchase' ? '+' : ''}{entry.credits}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-white">{entry.description || entry.type}</p>
                    <p className="text-xs text-slate-500">{formatDate(entry.created_at)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <Link href="/buy-credits" className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition text-sm text-center">Buy More Credits</Link>
        <Link href="/credits-billing" className="flex-1 px-6 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/5 transition text-sm text-center">View All Transactions</Link>
      </div>

      {copied && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-4 py-2 rounded-xl text-sm shadow-lg">
          Copied {copied}!
        </div>
      )}
    </div>
  )
}