'use client'

import { create } from 'zustand'
import { supabaseClient } from './supabase/client'
import type { User } from './types'

interface AuthState {
  user: User | null
  loading: boolean
  initialized: boolean
  error: string | null
  initialize: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ error?: string; data?: any }>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,
  error: null,

  /**
   * Initialize auth state from session
   */
  initialize: async () => {
    if (!supabaseClient) {
      set({ loading: false, initialized: true });
      return;
    }

    try {
      const { data: { session } } = await supabaseClient.auth.getSession();

      if (session?.user) {
        // Use maybeSingle() instead of single() to avoid error when no row
        const { data: profile } = await supabaseClient
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile) {
          set({ user: profile as User, loading: false, initialized: true });
          return;
        }

        // Create profile if not exists using upsert to avoid race condition
        const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User';
        const { data: createdProfile } = await supabaseClient
          .from('users')
          .upsert({
            id: session.user.id,
            email: session.user.email!,
            name,
            avatar_url: session.user.user_metadata?.avatar_url || null,
            plan: 'free',
            credits: 50,
            xp: 0,
            level: 1,
            is_admin: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' })
          .select()
          .maybeSingle();

        if (createdProfile) {
          set({ user: createdProfile as User });
        }
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
    } finally {
      set({ loading: false, initialized: true });
    }
  },

  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string) => {
    if (!supabaseClient) return { error: 'Supabase not configured' };

    try {
      set({ loading: true, error: null });

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { error: 'Invalid email or password' };
        }
        return { error: error.message };
      }

      if (data.user) {
        // Fetch profile using maybeSingle
        let { data: profile } = await supabaseClient
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (!profile) {
          // Create profile if not exists
          const name = data.user.email?.split('@')[0] || 'User';
          const { data: newProfile } = await supabaseClient
            .from('users')
            .upsert({
              id: data.user.id,
              email: data.user.email!,
              name,
              plan: 'free',
              credits: 50,
              xp: 0,
              level: 1,
              is_admin: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, { onConflict: 'id' })
            .select()
            .maybeSingle();

          if (newProfile) profile = newProfile;
        }

        if (profile) {
          set({ user: profile as User });
        }
      }

      return {};
    } catch (err: any) {
      return { error: err.message || 'An unexpected error occurred' };
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Sign up with email, password and name
   */
  signUp: async (email: string, password: string, name: string) => {
    if (!supabaseClient) return { error: 'Supabase not configured' };

    try {
      set({ loading: true, error: null });

      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/auth/verify?email=${encodeURIComponent(email)}`,
        },
      });

      if (error) return { error: error.message };

      if (data.user) {
        // Create profile immediately after signup using upsert
        const { error: profileError } = await supabaseClient
          .from('users')
          .upsert({
            id: data.user.id,
            email: data.user.email!,
            name,
            avatar_url: null,
            plan: 'free',
            credits: 50,
            xp: 0,
            level: 1,
            is_admin: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });

        if (profileError) {
          console.error('Profile creation error on signup:', profileError);
        }

        // Fetch the profile
        const { data: profile } = await supabaseClient
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profile) {
          set({ user: profile as User });
        }

        return { data };
      }

      return {};
    } catch (err: any) {
      return { error: err.message || 'An unexpected error occurred' };
    } finally {
      set({ loading: false });
    }
  },

  /**
   * Sign out current user
   */
  signOut: async () => {
    if (!supabaseClient) return;

    try {
      await supabaseClient.auth.signOut();
      set({ user: null });
    } catch (err) {
      console.error('Sign out error:', err);
    }
  },

  /**
   * Refresh current user data from database
   */
  refreshUser: async () => {
    if (!supabaseClient) return;

    try {
      const { data: { user: authUser } } = await supabaseClient.auth.getUser();
      if (!authUser) {
        set({ user: null });
        return;
      }

      const { data: profile } = await supabaseClient
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (profile) {
        set({ user: profile as User });
      }
    } catch (err) {
      console.error('Refresh user error:', err);
    }
  },
}))