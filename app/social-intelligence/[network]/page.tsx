import { notFound } from 'next/navigation'
import { socialFeatures } from '../../../lib/features'
import { getFeatureByKey } from '../../../lib/features/registry'
import FeatureWorkspace from '../../../components/FeatureWorkspace'
import ComingSoonFeature from '../../../components/ComingSoonFeature'
import type { Metadata } from 'next'
import { TOOLS_SEO } from '../../../lib/config'
import { generateMetadata as seoMetadata } from '../../../lib/seo'

interface Props {
  params: Promise<{ network: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { network } = await params
  const toolSEO = TOOLS_SEO[network]
  if (!toolSEO) return {}
  return seoMetadata({
    title: toolSEO.title,
    description: toolSEO.description,
    path: toolSEO.path,
    keywords: toolSEO.keywords,
    ogType: 'website',
  })
}

export default async function SocialFeaturePage({ params }: Props) {
  const resolved = await params
  const feature = socialFeatures.find((item) => item.key === resolved.network)
  if (!feature) notFound()

  // Check if feature is coming_soon using registry
  const registryEntry = getFeatureByKey(resolved.network)
  const isComingSoon = registryEntry?.status === 'coming_soon'

  if (isComingSoon) {
    return (
      <div className="space-y-6">
        <ComingSoonFeature
          title={feature.title}
          description={feature.description}
          platform={feature.platform || 'linkedin'}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <FeatureWorkspace title={feature.title} description={feature.description} inputLabel={feature.inputLabel} featureKey={resolved.network} />
    </div>
  )
}