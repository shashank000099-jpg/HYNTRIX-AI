import { notFound } from 'next/navigation';
import { opportunityFeatures } from '../../../lib/features';
import FeatureWorkspace from '../../../components/FeatureWorkspace';

export default async function OpportunityFeaturePage({ params }: { params: Promise<{ feature: string }> }) {
  const resolved = await params;
  const feature = opportunityFeatures.find((item) => item.key === resolved.feature);
  if (!feature) notFound();

  return (
    <div className="space-y-6">
      <FeatureWorkspace title={feature.title} description={feature.description} inputLabel={feature.inputLabel} />
    </div>
  );
}
