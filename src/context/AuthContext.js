import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) console.error('Session error:', error);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) console.error('Sign out error:', error);
    },
    recordPrediction: async (predictionData) => {
      if (!user) return { error: 'Not authenticated' };
      
      const { data, error } = await supabase
        .from('predictions')
        .insert([{
          user_id: user.id,
          ...predictionData
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
      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('team_name', teamName)
        .order('created_at', { ascending: false });
      
      return { data, error };
    },
    updatePredictionOutcome: async (predictionId, outcome) => {
      if (!user) return { error: 'Not authenticated' };
      
      const { data, error } = await supabase
        .from('predictions')
        .update({ outcome })
        .eq('id', predictionId)
        .select()
        .single();
      
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