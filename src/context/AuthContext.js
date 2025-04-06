// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      if (event === 'SIGNED_OUT') {
        window.location.reload(); // Refresh page on sign out
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    signOut: async () => {
      await supabase.auth.signOut();
      window.location.reload(); // Ensure page refreshes after sign out
    },
    recordPrediction: async (predictionData) => {
      if (!user) return { error: 'Not authenticated' };
      
      const { data, error } = await supabase
        .from('predictions')
        .insert([{
          ...predictionData,
          user_id: user.id,
          username: user.user_metadata?.username || user.email.split('@')[0]
        }])
        .select()
        .single();
      return { data, error };
    },
    getUserPredictions: async () => {
      if (!user) return { data: null, error: 'Not authenticated' };
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      return { data, error };
    },
    getTeamPredictions: async (teamName) => {
      if (!user) return { data: null, error: 'Not authenticated' };
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('team_name', teamName)
        .eq('user_id', user.id);
      return { data, error };
    },
    getGlobalStats: async () => {
      const { data, error } = await supabase
        .from('predictions')
        .select('*');
      return { data, error };
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};