'use client'

import Card from './ui/Card'
import BackButton from './ui/BackButton'

interface ComingSoonFeatureProps {
  title: string
  description: string
  platform?: string
}

const platformIcons: Record<string, string> = {
  linkedin: '💼',
  facebook: '📘',
  instagram: '📸',
  youtube: '📹',
  x: '𝕏',
  telegram: '✈️',
}

export default function ComingSoonFeature({ title, description, platform = 'linkedin' }: ComingSoonFeatureProps) {
  return (
    <div className="space-y-6">
      <BackButton href="/social-intelligence" label="Back to Social Intelligence" />
      
      <Card className="border-dashed border-yellow-500/30 bg-gradient-to-br from-yellow-500/5 via-slate-900/50 to-yellow-500/5">
        <div className="space-y-6 p-6 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-yellow-500/20 border border-yellow-500/30">
            <span className="text-4xl">{platformIcons[platform] || '🚧'}</span>
          </div>
          
          <div className="space-y-3 max-w-xl mx-auto">
            <div className="inline-block px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-semibold border border-yellow-500/30 mb-2">
              🚧 Coming Soon
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{title}</h1>
            <p className="text-slate-400 leading-relaxed">{description}</p>
          </div>

          <div className="max-w-md mx-auto space-y-4">
            <div className="rounded-xl bg-white/5 border border-white/10 p-5 text-left">
              <h3 className="text-sm font-semibold text-white mb-2">What to Expect</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5">•</span>
                  <span>Deep analysis of professional brand presence and authority</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5">•</span>
                  <span>Content strategy evaluation and engagement metrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5">•</span>
                  <span>Network strength and thought leadership assessment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 mt-0.5">•</span>
                  <span>Opportunity generation and growth recommendations</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-sm text-slate-500">
            {platform === 'linkedin' 
              ? 'LinkedIn Intelligence is under development. It will be available soon with full AI-powered analysis.'
              : `${title} is under development. It will be available soon.`
            }
          </div>
        </div>
      </Card>
    </div>
  )
}