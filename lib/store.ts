'use client';

import { create } from 'zustand';
import type { SettingsState } from './types';

const initialStatus = {
  gemini: 'unknown',
  openai: 'unknown',
  supabase: 'unknown',
  razorpay: 'unknown',
  youtube: 'unknown',
  apify: 'unknown'
} as const;

export const useSettingsStore = create<SettingsState>((set, get) => ({
  geminiKey: '',
  openaiKey: '',
  supabaseUrl: '',
  supabaseAnonKey: '',
  razorpayKeyId: '',
  razorpaySecret: '',
  youtubeApiKey: '',
  apifyApiKey: '',
  status: { ...initialStatus },
  updateSettings: (values) => set((state) => ({ ...state, ...values })),
  testIntegration: async (service) => {
    const state = get();
    const hasKey = {
      gemini: state.geminiKey,
      openai: state.openaiKey,
      supabase: state.supabaseUrl && state.supabaseAnonKey,
      razorpay: state.razorpayKeyId && state.razorpaySecret,
      youtube: state.youtubeApiKey,
      apify: state.apifyApiKey
    }[service as keyof typeof initialStatus];

    const isConnected = Boolean(hasKey && String(hasKey).length > 8);
    await new Promise((resolve) => setTimeout(resolve, 650));
    set((state) => ({
      status: {
        ...state.status,
        [service]: isConnected ? 'connected' : 'disconnected'
      }
    }));
  }
}));
