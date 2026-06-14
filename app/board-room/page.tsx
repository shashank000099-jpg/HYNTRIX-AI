'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { boardAdvisors } from '../../lib/features';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function BoardRoomPage() {
  const router = useRouter();

  const handleConsultAdvisor = (key: string) => {
    router.push(`/board-room/${key}`);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Board Room</p>
        <h1 className="text-4xl font-semibold text-white">AI Board of Directors</h1>
        <p className="max-w-3xl text-sm leading-7 text-slate-300">Four expert advisor personas deliver independent recommendations for product, growth, finance and legal strategy.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {boardAdvisors.map((advisor) => (
          <Card key={advisor.key} className="group transition hover:-translate-y-1">
            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{advisor.title}</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">{advisor.description}</h2>
              </div>
              <div className="flex items-center justify-between">
                <Link href={`/board-room/${advisor.key}` as any} className="text-sm font-semibold text-primary hover:text-secondary">Consult</Link>
                <Button variant="ghost" onClick={() => handleConsultAdvisor(advisor.key)}>Ask</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
