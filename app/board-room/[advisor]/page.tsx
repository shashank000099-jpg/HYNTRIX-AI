import { notFound } from 'next/navigation';
import { boardAdvisors } from '../../../lib/features';
import AdvisorPanel from '../../../components/board-room/AdvisorPanel';

export default async function AdvisorPage({ params }: { params: Promise<{ advisor: string }> }) {
  const resolved = await params;
  const advisor = boardAdvisors.find((item) => item.key === resolved.advisor);
  if (!advisor) notFound();

  return <AdvisorPanel advisor={advisor} />;
}
