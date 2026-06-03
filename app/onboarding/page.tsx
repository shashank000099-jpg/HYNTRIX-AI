'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabaseClient } from '../../lib/supabase/client';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

// Simple validation schema
const onboardingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  age: z.string().optional(),
  goal: z.string().min(1, 'Please select a goal'),
  skills: z.string().optional(),
  budget: z.string().optional()
});

type OnboardingForm = z.infer<typeof onboardingSchema>;

const GOAL_OPTIONS = [
  { value: 'start-business', label: 'Start a Business' },
  { value: 'grow-instagram', label: 'Grow My Instagram' },
  { value: 'start-youtube', label: 'Start YouTube Channel' },
  { value: 'make-money', label: 'Make Money Online' },
  { value: 'find-ideas', label: 'Find Business Ideas' },
  { value: 'improve-skills', label: 'Improve My Skills' }
];

const SKILL_OPTIONS = [
  'Marketing',
  'Design',
  'Programming',
  'Sales',
  'Product',
  'Finance',
  'Leadership',
  'Writing'
];

export default function OnboardingPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [step, setStep] = useState(1);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      goal: 'start-business'
    }
  });

  const selectedGoal = watch('goal');

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const onSubmit = async (data: OnboardingForm) => {
    if (!supabaseClient) {
      setError('Setup error. Please check your configuration.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Get current user
      const { data: { user } } = await supabaseClient.auth.getUser();

      if (!user) {
        setError('You are not logged in');
        return;
      }

      // Update user profile
      const { error: updateError } = await supabaseClient
        .from('users')
        .update({
          name: data.name,
          age: data.age ? parseInt(data.age) : null,
          goal: data.goal,
          skills: selectedSkills,
          budget: data.budget,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        setError('Failed to save profile. Try again.');
        return;
      }

      // Create user settings
      await supabaseClient
        .from('settings')
        .insert({
          user_id: user.id,
          notifications_enabled: true,
          email_updates: true,
          theme: 'dark',
          language: 'en'
        })
        .select()
        .single();

      // Initialize user credits and streaks
      await supabaseClient
        .from('credits')
        .insert({
          user_id: user.id,
          amount: 3, // 3 free reports per day
          remaining: 3,
          plan_name: 'free'
        });

      await supabaseClient
        .from('streaks')
        .insert({
          user_id: user.id,
          streak_days: 1,
          last_active_at: new Date().toISOString()
        });

      // Redirect to home
      router.push('/');
    } catch (err) {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome!</h1>
          <p className="text-gray-400">Let's set up your profile</p>
        </div>

        {/* Progress */}
        <div className="mb-8 flex gap-2">
          <div className={`h-1 flex-1 rounded-full transition ${step >= 1 ? 'bg-blue-500' : 'bg-white/10'}`} />
          <div className={`h-1 flex-1 rounded-full transition ${step >= 2 ? 'bg-blue-500' : 'bg-white/10'}`} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Tell us about yourself</h2>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Your Name *</label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  {...register('name')}
                  error={!!errors.name}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Age (optional)</label>
                <Input
                  type="number"
                  placeholder="25"
                  {...register('age')}
                  error={!!errors.age}
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Budget (optional)</label>
                <select
                  {...register('budget')}
                  className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white transition placeholder-gray-500"
                >
                  <option value="">Select your budget</option>
                  <option value="500">₹0 - ₹500</option>
                  <option value="1000">₹500 - ₹1000</option>
                  <option value="5000">₹1000 - ₹5000</option>
                  <option value="10000">₹5000 - ₹10000</option>
                  <option value="50000">₹10000+</option>
                </select>
              </div>

              {/* Next Button */}
              <Button
                type="button"
                onClick={() => setStep(2)}
                className="w-full"
              >
                Continue →
              </Button>
            </div>
          )}

          {/* Step 2: Goal & Skills */}
          {step === 2 && (
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">What's your main goal?</h2>
              </div>

              {/* Goal Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-4">Goal *</label>
                <div className="space-y-3">
                  {GOAL_OPTIONS.map(option => (
                    <label key={option.value} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        value={option.value}
                        {...register('goal')}
                        className="mr-3 w-5 h-5"
                      />
                      <span className="text-white group-hover:text-blue-400 transition">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.goal && (
                  <p className="mt-2 text-xs text-red-400">{errors.goal.message}</p>
                )}
              </div>

              {/* Skills Selection */}
              <div>
                <label className="block text-sm font-medium text-white mb-4">Your Skills (optional)</label>
                <div className="grid grid-cols-2 gap-3">
                  {SKILL_OPTIONS.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-4 py-2 rounded-xl border transition ${
                        selectedSkills.includes(skill)
                          ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                          : 'border-white/20 bg-white/5 hover:bg-white/10 text-gray-300'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1"
                  variant="secondary"
                >
                  ← Back
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? 'Creating profile...' : 'Get Started →'}
                </Button>
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-8">
          You can update this information anytime in Settings
        </p>
      </div>
    </div>
  );
}
