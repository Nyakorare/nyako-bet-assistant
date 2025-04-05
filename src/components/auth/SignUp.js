import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Button from '../ui/button';

export default function SignUp({ darkMode, onSuccess, onSwitchToSignIn }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateEmail = (email) => {
    const re = /@(gmail|yahoo)\.com$/;
    return re.test(email.toLowerCase());
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate email domain
      if (!validateEmail(email)) {
        throw new Error('Only Gmail and Yahoo emails are allowed');
      }

      // Check if email already exists
      const { data: emailData, error: emailError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();

      if (emailData) {
        throw new Error('Email already in use');
      }

      // Check if username already exists
      const { data: usernameData, error: usernameError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (usernameData) {
        throw new Error('Username already taken');
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // Create profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: authData.user.id, 
            email, 
            username,
            created_at: new Date().toISOString() 
          }
        ]);

      if (profileError) throw profileError;
      if (onSuccess) onSuccess();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg`}>
      <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>Sign Up</h2>
      {error && (
        <div className={`mb-4 p-3 rounded ${darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800'}`}>
          {error}
        </div>
      )}
      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email (Gmail/Yahoo only)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>
      <div className="mt-4 text-center">
        <button
          onClick={onSwitchToSignIn}
          className={`text-sm ${darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500'} underline`}
        >
          Already have an account? Sign In
        </button>
      </div>
    </div>
  );
}