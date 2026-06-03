// ============================================
// AUTHENTICATION & USER TYPES
// ============================================

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  age: number | null;
  skills: string[] | null;
  budget: string | null;
  goal: string | null;
  plan: 'free' | 'premium' | 'pro' | 'enterprise';
  credits: number;
  xp: number;
  level: number;
  created_at: string;
  updated_at: string;
  is_admin: boolean;
}

export interface AuthSession {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// ============================================
// REPORT TYPES
// ============================================

export interface StartupReport {
  id: string;
  user_id: string;
  startup_name: string;
  startup_description: string;
  market_score: number;
  competition_score: number;
  revenue_score: number;
  risk_score: number;
  total_score: number;
  verdict: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  action_plan: string[];
  report_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface FounderReport {
  id: string;
  user_id: string;
  founder_type: string;
  strengths: string[];
  weaknesses: string[];
  skills: string[];
  action_plan: string[];
  score: number;
  report_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SocialReport {
  id: string;
  user_id: string;
  platform: 'instagram' | 'youtube' | 'linkedin' | 'telegram' | 'x';
  username: string;
  growth_score: number;
  brand_score: number;
  trust_score: number;
  content_ideas: string[];
  suggestions: string[];
  report_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export type Report = StartupReport | FounderReport | SocialReport;

// ============================================
// CREDIT & PAYMENT TYPES
// ============================================

export interface Credit {
  id: string;
  user_id: string;
  amount: number;
  used: number;
  remaining: number;
  plan_name: string;
  expires_at: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  plan: string;
  created_at: string;
}

// ============================================
// FEATURE TYPES
// ============================================

export type IntegrationStatus = 'connected' | 'disconnected' | 'unknown';

export interface SettingsState {
  geminiKey: string;
  openaiKey: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  razorpayKeyId: string;
  razorpaySecret: string;
  youtubeApiKey: string;
  apifyApiKey: string;
  status: Record<string, IntegrationStatus>;
  updateSettings: (values: Partial<SettingsState>) => void;
  testIntegration: (service: string) => Promise<void>;
}

export interface FeatureDefinition {
  key: string;
  title: string;
  description: string;
  category?: string;
  inputLabel?: string;
  fields?: string[];
}

// ============================================
// ADVISOR & EXPERT TYPES
// ============================================

export interface Advisor {
  id: string;
  name: string;
  role: 'product' | 'growth' | 'finance' | 'legal';
  expertise: string;
  photo_url: string;
}

export interface AdvisorFeedback {
  id: string;
  user_id: string;
  session_id: string;
  advisor_id: string;
  question: string;
  feedback: string;
  created_at: string;
}

export interface SharkProfile {
  id: string;
  name: string;
  industry: string;
  investment_range: string;
  photo_url: string;
  personality: string;
}
