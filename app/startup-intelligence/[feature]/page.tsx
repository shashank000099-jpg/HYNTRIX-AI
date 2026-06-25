import { notFound } from 'next/navigation';
import { startupFeatures } from '../../../lib/features';
import FeatureWorkspace from '../../../components/FeatureWorkspace';
import FeatureEvaluationContext from '../../../components/FeatureEvaluationContext';
import type { Metadata } from 'next';
import { TOOLS_SEO } from '../../../lib/config';
import { generateMetadata as seoMetadata } from '../../../lib/seo';

interface Props {
  params: Promise<{ feature: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { feature } = await params;
  const toolSEO = TOOLS_SEO[feature];
  if (!toolSEO) return {};
  return seoMetadata({
    title: toolSEO.title,
    description: toolSEO.description,
    path: toolSEO.path,
    keywords: toolSEO.keywords,
    ogType: 'website',
  });
}

export default async function StartupFeaturePage({ params }: Props) {
  const resolved = await params;
  const feature = startupFeatures.find((item) => item.key === resolved.feature);
  if (!feature) notFound();

  return (
    <div className="space-y-12">
      <FeatureWorkspace title={feature.title} description={feature.description} inputLabel={feature.inputLabel} featureKey={resolved.feature} />
      <FeatureEvaluationContext category="startup" featureKey={resolved.feature} featureTitle={feature.title} />
    </div>
  );
}
