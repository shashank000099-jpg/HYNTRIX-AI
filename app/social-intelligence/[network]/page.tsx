import { notFound } from 'next/navigation';
import { socialFeatures } from '../../../lib/features';
import FeatureWorkspace from '../../../components/FeatureWorkspace';

export default async function SocialNetworkPage({ params }: { params: Promise<{ network: string }> }) {
  const resolved = await params;
  const feature = socialFeatures.find((item) => item.key === resolved.network);
  if (!feature) notFound();

  return (
    <div className="space-y-6">
      <FeatureWorkspace title={feature.title} description={feature.description} inputLabel={feature.inputLabel} />
    </div>
  );
}