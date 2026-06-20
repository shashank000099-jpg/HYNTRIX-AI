'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../lib/auth-store'
import { getSavedReports, deleteSavedReport, searchSavedReports, filterSavedReports, type SavedReport } from '../../lib/reports'
import { Trash2, Search, Filter, Bookmark } from 'lucide-react'
import Link from 'next/link'

type FilterType = 'all' | 'startup' | 'founder' | 'social'

export default function SavedReportsPage() {
  const { user } = useAuthStore()
  const [reports, setReports] = useState<SavedReport[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

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
        setError('Failed to load saved reports. Please refresh the page.')
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [user?.id])

  const handleDelete = async (reportId: string) => {
    setDeleting(reportId)
    const success = await deleteSavedReport(reportId)
    if (success) {
      setReports(prev => prev.filter(r => r.id !== reportId))
    }
    setDeleting(null)
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

  const clearFilters = () => {
    setFilter('all')
    setSearchQuery('')
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
          <p className="mt-4 text-slate-400 text-sm">Loading reports...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-8 text-center">
          <p className="text-red-400">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 text-sm text-blue-400 hover:text-blue-300">
            Refresh page
          </button>
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="empty-state">
          <p className="text-3xl mb-4">
            {searchQuery || filter !== 'all' ? '🔍' : '📁'}
          </p>
          <p className="text-slate-400">
            {searchQuery 
              ? `No reports match "${searchQuery}"` 
              : filter !== 'all' 
                ? `No ${filter} reports saved` 
                : 'No saved reports yet.'}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {searchQuery || filter !== 'all' 
              ? 'Try different search terms or clear filters' 
              : 'Save reports as you use Hyntrix AI tools.'}
          </p>
          {(searchQuery || filter !== 'all') ? (
            <button onClick={clearFilters} className="mt-4 text-sm text-blue-400 hover:text-blue-300">
              Clear filters →
            </button>
          ) : (
            <Link href="/startup-intelligence" className="mt-4 inline-block text-sm text-blue-400 hover:text-blue-300">
              Analyze your first startup →
            </Link>
          )}
        </div>
      ) : (
        <>
          <p className="text-xs text-slate-500">
            Showing {filteredReports.length} of {reports.length} reports
          </p>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredReports.map((report, index) => {
              const badge = getTypeBadge(report.report_type)
              return (
                <Link key={report.id} href={'/saved-reports/report/' + report.report_id as any} className="block">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="group rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Bookmark className="h-3 w-3 text-slate-500" />
                          <span className={`text-xs px-2 py-0.5 rounded-full ${badge.color}`}>
                            {badge.label}
                          </span>
                        </div>
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
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                      <p className="text-xs text-slate-500">
                        {new Date(report.saved_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <button
                        onClick={(e) => { e.preventDefault(); handleDelete(report.id); }}
                        disabled={deleting === report.id}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all disabled:opacity-50"
                        title="Delete report"
                      >
                        {deleting === report.id ? (
                          <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}