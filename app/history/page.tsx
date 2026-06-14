'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../lib/auth-store'
import { getHistory, type HistoryEntry } from '../../lib/reports'
import { Search, Filter } from 'lucide-react'

type FilterType = 'all' | 'startup' | 'founder' | 'social'

export default function HistoryPage() {
  const { user } = useAuthStore()
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchHistory() {
      if (!user?.id) {
        setLoading(false)
        return
      }
      try {
        setError(null)
        const data = await getHistory(user.id)
        setHistory(data)
      } catch (err) {
        console.error('Error fetching history:', err)
        setError('Failed to load history. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [user?.id])

  const filteredHistory = history.filter(h => {
    const matchesFilter = filter === 'all' || h.feature_type === filter
    const matchesSearch = !searchQuery || 
      h.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.feature?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const getTypeBadge = (type?: string | null) => {
    switch (type) {
      case 'startup': return { label: 'Startup', color: 'bg-blue-500/20 text-blue-400' }
      case 'founder': return { label: 'Founder', color: 'bg-purple-500/20 text-purple-400' }
      case 'social': return { label: 'Social', color: 'bg-pink-500/20 text-pink-400' }
      default: return { label: 'General', color: 'bg-white/10 text-slate-300' }
    }
  }

  const clearFilters = () => {
    setFilter('all')
    setSearchQuery('')
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">History</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Activity Log</h1>
        <p className="mt-2 text-sm text-slate-400">Your recent actions and analyses across Hyntrix AI.</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'startup', 'founder', 'social'] as FilterType[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                filter === f
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Indicator */}
      {(searchQuery || filter !== 'all') && (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Filter className="h-3 w-3" />
          <span>Filters active</span>
          <button onClick={clearFilters} className="text-blue-400 hover:text-blue-300 ml-2">
            Clear all
          </button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-400 text-sm">Loading history...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-sm text-blue-400 hover:text-blue-300">
            Refresh page
          </button>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="empty-state">
          <p className="text-3xl mb-4">{searchQuery || filter !== 'all' ? '🔍' : '📋'}</p>
          <p className="text-slate-400">
            {searchQuery 
              ? `No results match "${searchQuery}"` 
              : filter !== 'all' 
                ? `No ${filter} activity found` 
                : 'No activity yet.'}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {searchQuery || filter !== 'all' 
              ? 'Try different search terms or clear filters' 
              : 'Start using Hyntrix AI tools to see your history here.'}
          </p>
          {(searchQuery || filter !== 'all') && (
            <button onClick={clearFilters} className="mt-4 text-sm text-blue-400 hover:text-blue-300">
              Clear filters →
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-slate-500">
            Showing {filteredHistory.length} of {history.length} activities
          </p>
          {filteredHistory.map((entry, index) => {
            const badge = getTypeBadge(entry.feature_type)
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-white">{entry.action}</p>
                    {entry.feature && <p className="text-xs text-slate-500">Feature: {entry.feature}</p>}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(entry.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                  {entry.score != null && (
                    <div className="rounded-xl bg-white/5 px-3 py-1 text-sm font-semibold text-white">
                      {entry.score}
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}