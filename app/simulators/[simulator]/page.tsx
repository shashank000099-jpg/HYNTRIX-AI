import { notFound } from 'next/navigation';
import { simulatorFeatures } from '../../../lib/features';
import SimulatorPanel from '../../../components/simulators/SimulatorPanel';

export default async function SimulatorPage({ params }: { params: Promise<{ simulator: string }> }) {
  const resolved = await params;
  const simulator = simulatorFeatures.find((item) => item.key === resolved.simulator);
  if (!simulator) notFound();

  return <SimulatorPanel title={simulator.title} description={simulator.description} />;
}
