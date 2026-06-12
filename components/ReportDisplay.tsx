'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { StartupReport, FounderReport, SocialReport } from '../lib/types';
import { getScoreColor, getScoreBgColor, formatDate } from '../lib/utils';
import Button from './ui/Button';

interface ReportCardProps {
  report: StartupReport | FounderReport | SocialReport;
  onSave?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

/**
 * Display a report card with score, insights, and actions
 */
export default function ReportCard({ report, onSave, onDownload, onShare }: ReportCardProps) {
  const isStartupReport = 'startup_name' in report;
  const isFounderReport = 'founder_type' in report;
  const isSocialReport = 'platform' in report;

  const score = isStartupReport ? report.total_score : isSocialReport ? report.growth_score : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-8 space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isStartupReport ? report.startup_name : isFounderReport ? report.founder_type : report.username}
          </h2>
          <p className="text-gray-400 text-sm">
            Generated on {formatDate(report.created_at)}
          </p>
        </div>

        {/* Score Badge */}
        <div className={`rounded-2xl ${getScoreBgColor(score)} border border-white/10 p-4 text-center`}>
          <div className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</div>
          <div className="text-xs text-gray-400 mt-1">Score</div>
        </div>
      </div>

      {/* Verdict / Type */}
      {isStartupReport && (
        <div className="rounded-2xl bg-blue-500/10 border border-blue-500/30 p-4">
          <p className="text-sm text-gray-400 mb-1">Verdict</p>
          <p className="text-lg font-semibold text-blue-400">{report.verdict}</p>
        </div>
      )}

      {isFounderReport && (
        <div className="rounded-2xl bg-green-500/10 border border-green-500/30 p-4">
          <p className="text-sm text-gray-400 mb-1">Founder Type</p>
          <p className="text-lg font-semibold text-green-400">{report.founder_type}</p>
        </div>
      )}

      {isSocialReport && (
        <div className="rounded-2xl bg-purple-500/10 border border-purple-500/30 p-4">
          <p className="text-sm text-gray-400 mb-1">Platform</p>
          <p className="text-lg font-semibold text-purple-400 capitalize">{report.platform}</p>
        </div>
      )}

      {/* Scores Grid (for all report types) */}
      {isStartupReport && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl bg-white/5 p-3">
            <p className="text-xs text-gray-500 mb-1">Market</p>
            <p className="text-xl font-bold text-white">{report.market_score}/100</p>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <p className="text-xs text-gray-500 mb-1">Competition</p>
            <p className="text-xl font-bold text-white">{report.competition_score}/100</p>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <p className="text-xs text-gray-500 mb-1">Revenue</p>
            <p className="text-xl font-bold text-white">{report.revenue_score}/100</p>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <p className="text-xs text-gray-500 mb-1">Risk</p>
            <p className="text-xl font-bold text-white">{report.risk_score}/100</p>
          </div>
        </div>
      )}

      {isSocialReport && (
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-white/5 p-3">
            <p className="text-xs text-gray-500 mb-1">Growth</p>
            <p className="text-xl font-bold text-white">{report.growth_score}/100</p>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <p className="text-xs text-gray-500 mb-1">Brand</p>
            <p className="text-xl font-bold text-white">{report.brand_score}/100</p>
          </div>
          <div className="rounded-xl bg-white/5 p-3">
            <p className="text-xs text-gray-500 mb-1">Trust</p>
            <p className="text-xl font-bold text-white">{report.trust_score}/100</p>
          </div>
        </div>
      )}

      {/* Strengths */}
      {(report.strengths || isStartupReport || isFounderReport) && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">✅ Strengths</h3>
          <ul className="space-y-2">
            {(report.strengths || []).map((strength, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="text-green-400 font-bold">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weaknesses */}
      {(report.weaknesses || isStartupReport || isFounderReport) && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">⚠️ Weaknesses</h3>
          <ul className="space-y-2">
            {(report.weaknesses || []).map((weakness, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="text-red-400 font-bold">•</span>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {(report.recommendations || isStartupReport) && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">💡 Recommendations</h3>
          <ul className="space-y-2">
            {(report.recommendations || []).map((rec, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="text-blue-400 font-bold">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Plan */}
      {(report.action_plan || isStartupReport || isFounderReport) && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">🎯 Action Plan</h3>
          <ol className="space-y-2">
            {(report.action_plan || []).map((action, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="text-yellow-400 font-bold">{idx + 1}.</span>
                <span>{action}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Content Ideas (for social reports) */}
      {isSocialReport && report.content_ideas && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">📝 Content Ideas</h3>
          <ul className="space-y-2">
            {report.content_ideas.map((idea, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="text-purple-400 font-bold">•</span>
                <span>{idea}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions (for social reports) */}
      {isSocialReport && report.suggestions && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">🚀 Suggestions</h3>
          <ul className="space-y-2">
            {report.suggestions.map((suggestion, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="text-cyan-400 font-bold">→</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
        {onSave && (
          <button
            onClick={onSave}
            className="flex-1 px-4 py-2 rounded-xl bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 transition text-sm font-medium"
          >
            💾 Save Report
          </button>
        )}

        {onDownload && (
          <button
            onClick={onDownload}
            className="flex-1 px-4 py-2 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30 transition text-sm font-medium"
          >
            📥 Download PDF
          </button>
        )}

        {onShare && (
          <button
            onClick={onShare}
            className="flex-1 px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 transition text-sm font-medium"
          >
            🔗 Share Report
          </button>
        )}
      </div>
    </motion.div>
  );
}
