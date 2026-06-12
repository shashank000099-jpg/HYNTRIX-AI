'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import { mockHistoryReports } from '../../lib/mock-data';

type Filter = 'all' | 'startup' | 'founder' | 'social' | 'opportunity';

const typeColors: Record<string, string> = {
  startup: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
  founder: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
  social: 'from-pink-500/20 to-pink-600/10 border-pink-500/30',
  opportunity: 'from-green-500/20 to-green-600/10 border-green-500/30'
};

export default function HistoryPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = mockHistoryReports.filter((report) => {
    const matchesQuery = report.title.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'all' || report.type === filter;
    return matchesQuery && matchesFilter;
  });

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">History</p>
        <h1 className="text-4xl font-semibold text-white">Report History</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">Search, filter and manage all your previous analyses and insights.</p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex-1">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500/50"
            placeholder="Search reports by title..."
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'startup', 'founder', 'social', 'opportunity'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-3 py-2 text-xs font-medium transition capitalize ${
                filter === f ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <h3 className="text-lg font-semibold text-white mb-2">No reports found</h3>
            <p className="text-sm text-slate-400">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          filtered.map((report, idx) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <div className={`rounded-2xl border bg-gradient-to-r ${typeColors[report.type] || typeColors.startup} p-5`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-slate-300">{report.badge}</span>
                      <span className="text-xs text-slate-500">{report.date}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-white">{report.title}</h3>
                    <p className="mt-1 text-sm text-slate-400">{report.subtitle}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="rounded-xl bg-white/5 px-3 py-1 text-sm font-semibold text-white">{report.score}/100</div>
                    <div className="flex gap-2">
                      <button className="text-xs text-blue-400 hover:text-blue-300">Open</button>
                      <button className="text-xs text-slate-400 hover:text-white">Download</button>
                      <button className="text-xs text-red-400 hover:text-red-300">Delete</button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}