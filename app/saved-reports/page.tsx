'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../lib/auth-store'
import { getSavedReports, deleteSavedReport, type SavedReport } from '../../lib/reports'
import { Trash2, Search } from 'lucide-react'

type FilterType = 'all' | 'startup' | 'founder' | 'social'

export default function SavedReportsPage() {
  const { user } = useAuthStore()
  const [reports, setReports] = useState<SavedReport[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReports() {
      if (!user?.id) {
        setLoading(false)
        return
      }
      try {
        setError(null)
        const data = await getSavedReports(user.id)
        setReports(data)
      } catch (err) {
        console.error('Error fetching saved reports:', err)
        setError('Failed to load saved reports')
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [user?.id])

  const handleDelete = async (reportId: string) => {
    const success = await deleteSavedReport(reportId)
    if (success) {
      setReports(prev => prev.filter(r => r.id !== reportId))
    }
  }

  const filteredReports = reports.filter(r => {
    const matchesFilter = filter === 'all' || r.report_type === filter
    const matchesSearch = !searchQuery || 
      (r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       r.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'startup': return { label: 'Startup', color: 'bg-blue-500/20 text-blue-400' }
      case 'founder': return { label: 'Founder', color: 'bg-purple-500/20 text-purple-400' }
      case 'social': return { label: 'Social', color: 'bg-pink-500/20 text-pink-400' }
      default: return { label: 'General', color: 'bg-white/10 text-slate-300' }
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Library</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Saved Reports</h1>
        <p className="mt-2 text-sm text-slate-400">Your saved analyses and reports, all in one place.</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>
        <div className="flex gap-2">
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

      {/* Content */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-400 text-sm">Loading reports...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
          <p className="text-red-400">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-sm text-blue-400 hover:text-blue-300">
            Try again
          </button>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-3xl mb-4">📁</p>
          <p className="text-slate-400">
            {searchQuery ? 'No reports match your search.' : 'No saved reports yet.'}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {searchQuery ? 'Try a different search term.' : 'Save reports as you use Hyntrix AI tools.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredReports.map((report, index) => {
            const badge = getTypeBadge(report.report_type)
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${badge.color}`}>
                      {badge.label}
                    </span>
                    <h3 className="text-base font-semibold text-white">
                      {report.title || 'Untitled Report'}
                    </h3>
                    {report.subtitle && (
                      <p className="text-xs text-slate-400">{report.subtitle}</p>
                    )}
                  </div>
                  {report.score != null && (
                    <div className="rounded-xl bg-white/5 px-3 py-1 text-sm font-semibold text-white">
                      {report.score}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xs text-slate-500">
                    {new Date(report.saved_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <button
                    onClick={() => handleDelete(report.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all"
                    title="Delete report"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}