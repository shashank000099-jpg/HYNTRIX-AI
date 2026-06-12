'use client';

import { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LoadingOverlay from '../ui/LoadingOverlay';

interface SimulatorPanelProps {
  title: string;
  description: string;
}

export default function SimulatorPanel({ title, description }: SimulatorPanelProps) {
  const [persona, setPersona] = useState('Budget Buyer');
  const [conversation, setConversation] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setConversation((current) => [...current, `You: ${message.trim()}`]);
    setMessage('');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setConversation((current) => [...current, `AI ${persona}: Thanks for the prompt. I recommend clarifying value, highlighting your outcome proposition, and listening for objections.`]);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{title}</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">{description}</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">Choose a customer mindset and run an interactive simulation to practice your pitch or positioning.</p>
        </div>
        <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.22em] text-slate-500">Persona</p>
            <select value={persona} onChange={(event) => setPersona(event.target.value)} className="mt-2 rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-3 text-sm text-white outline-none">
              {['Budget Buyer', 'Power User', 'Skeptic', 'Premium Buyer'].map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <Button onClick={() => setConversation([])}>Reset conversation</Button>
        </div>
      </Card>

      <div className="relative">
        {loading ? <LoadingOverlay label="Simulating a premium conversation..." /> : null}
        <Card className="space-y-4">
          <div className="space-y-3">
            {conversation.length ? (
              conversation.map((line, index) => (
                <div key={index} className={`rounded-3xl px-4 py-3 ${line.startsWith('You:') ? 'bg-primary/10 text-white' : 'bg-white/5 text-slate-200'}`}>
                  {line}
                </div>
              ))
            ) : (
              <p className="text-sm leading-7 text-slate-400">Send a message to start the simulator and see the persona respond in real time.</p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
            <Input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Ask the customer persona a question..." />
            <Button onClick={sendMessage}>Send</Button>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-400">
            <span>Download conversation option placeholder.</span>
            <span>Ready for transcript export.</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
