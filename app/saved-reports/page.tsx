'use client';

import { motion } from 'framer-motion';
import { mockSavedReports } from '../../lib/mock-data';

export default function SavedReportsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Saved Reports</p>
        <h1 className="text-4xl font-semibold text-white">Your Report Library</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">Access polished report cards, open PDFs, and keep your most valuable analysis in one place.</p>
      </div>

      {mockSavedReports.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
          <p className="text-4xl mb-4">📂</p>
          <h3 className="text-lg font-semibold text-white mb-2">No saved reports</h3>
          <p className="text-sm text-slate-400">Save reports from any analysis to access them here later.</p>
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {mockSavedReports.map((report, idx) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-slate-300">{report.badge}</span>
                    <h3 className="mt-3 text-xl font-semibold text-white">{report.title}</h3>
                    <p className="mt-2 text-sm text-slate-400">{report.subtitle}</p>
                  </div>
                  <div className="rounded-xl bg-white/5 px-3 py-1 text-sm font-semibold text-white">{report.score}/100</div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>📅 {report.savedDate}</span>
                    <span>📄 {report.pages} pages</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs text-blue-400 hover:text-blue-300 px-2 py-1 rounded-lg bg-blue-500/10">Open</button>
                    <button className="text-xs text-green-400 hover:text-green-300 px-2 py-1 rounded-lg bg-green-500/10">Download</button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <h2 className="text-2xl font-semibold text-white">Report Templates & PDF Exports</h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">Every report supports a branded PDF layout with cover page, scores and recommendations. This workspace is ready for actual download generation.</p>
      </div>
    </div>
  );
}