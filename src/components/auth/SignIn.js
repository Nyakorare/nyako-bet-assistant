import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/button';

export default function SignIn({ darkMode, onSuccess, onSwitchToSignUp }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // First get the email associated with this username
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('email')
        .eq('username', username)
        .single();

      if (userError || !userData) {
        throw userError || new Error('User not found');
      }

      // Then sign in with email and password
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password,
      });

      if (authError) throw authError;
      if (onSuccess) onSuccess();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg`}>
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Sign In</h2>
      {error && (
        <div className={`mb-4 p-3 rounded ${darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800'}`}>
          {error}
        </div>
      )}
      <form onSubmit={handleSignIn} className="space-y-4">
        <div>
          <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-full p-3 rounded-lg border ${
              darkMode ? 'bg-gray-700 border-gray-600 focus:border-emerald-500' : 
              'bg-white border-gray-300 focus:border-emerald-400'
            } focus:outline-none focus:ring-2 ${
              darkMode ? 'focus:ring-emerald-500/50' : 'focus:ring-emerald-400/50'
            }`}
            required
          />
        </div>
        <div>
          <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-3 rounded-lg border ${
              darkMode ? 'bg-gray-700 border-gray-600 focus:border-emerald-500' : 
              'bg-white border-gray-300 focus:border-emerald-400'
            } focus:outline-none focus:ring-2 ${
              darkMode ? 'focus:ring-emerald-500/50' : 'focus:ring-emerald-400/50'
            }`}
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full mt-6"
          disabled={loading}
          darkMode={darkMode}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
      <div className="mt-4 text-center">
        <button
          onClick={onSwitchToSignUp}
          className={`text-sm ${darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500'} underline`}
        >
          Don't have an account? Sign Up
        </button>
      </div>
    </div>
  );
}