import { useState, useEffect } from "react";
import { FiX, FiMail, FiCheck, FiAlertCircle } from "react-icons/fi";
import Modal from "../../components/ui/modal";
import Button from "../../components/ui/button";
import { supabase } from "../../lib/supabase";

export default function AuthModal({ isOpen, onClose, darkMode, type }) {
  const [authType, setAuthType] = useState(type);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [emailAvailable, setEmailAvailable] = useState(true);
  const [formValid, setFormValid] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const isSignIn = authType === "signin";

  // Check username availability
  useEffect(() => {
    const checkUsername = async () => {
      if (username.length > 3) {
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username)
          .single();
        
        setUsernameAvailable(!data);
      }
    };

    const timer = setTimeout(() => {
      if (username) checkUsername();
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  // Check email availability
  useEffect(() => {
    const checkEmail = async () => {
      if (email.includes('@')) {
        const { data, error } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', email)
          .single();
        
        setEmailAvailable(!data);
      }
    };

    const timer = setTimeout(() => {
      if (email) checkEmail();
    }, 500);

    return () => clearTimeout(timer);
  }, [email]);

  // Validate form
  useEffect(() => {
    if (isSignIn) {
      setFormValid(email.length > 0 && password.length >= 6);
    } else {
      setFormValid(
        email.length > 0 &&
        emailAvailable &&
        username.length >= 4 &&
        usernameAvailable &&
        password.length >= 6 &&
        password === confirmPassword
      );
    }
  }, [email, password, confirmPassword, username, isSignIn, emailAvailable, usernameAvailable]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignIn) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        onClose();
      } else {
        if (!acceptedTerms) {
          setShowTerms(true);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
              accepted_terms: new Date().toISOString()
            },
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        setEmailSent(true);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} darkMode={darkMode}>
        <div className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <div className={`p-3 rounded-full ${
              darkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
            }`}>
              <FiMail className="text-2xl" />
            </div>
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${
            darkMode ? 'text-emerald-400' : 'text-emerald-600'
          }`}>
            Confirm Your Email
          </h2>
          <p className={`mb-6 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            We've sent a confirmation link to <span className="font-semibold">{email}</span>.
            Please check your inbox to activate your account.
          </p>
          <Button
            onClick={onClose}
            className="w-full"
            darkMode={darkMode}
          >
            Continue
          </Button>
        </div>
      </Modal>
    );
  }

  if (showTerms) {
    return (
      <Modal isOpen={isOpen} onClose={() => setShowTerms(false)} darkMode={darkMode}>
        <div className="p-6">
          <h2 className={`text-2xl font-bold mb-4 ${
            darkMode ? 'text-emerald-400' : 'text-emerald-600'
          }`}>
            Terms & Privacy Policy
          </h2>
          
          <div className={`max-h-96 overflow-y-auto mb-6 p-4 rounded-lg ${
            darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
          }`}>
            <h3 className="font-bold mb-2">Terms of Service</h3>
            <p className="mb-4 text-sm">
              By creating an account, you agree to our Terms of Service. You are responsible for maintaining 
              the confidentiality of your account and password. You agree to accept responsibility for all 
              activities that occur under your account.
            </p>
            
            <h3 className="font-bold mb-2">Privacy Policy</h3>
            <p className="text-sm">
              We collect personal information to provide and improve our service. Your data will be protected 
              and never sold to third parties. We may use your email to send important notifications about 
              your account or service updates.
            </p>
          </div>
          
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="accept-terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className={`mr-2 ${darkMode ? 'accent-emerald-400' : 'accent-emerald-600'}`}
            />
            <label htmlFor="accept-terms" className={`text-sm ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => setShowTerms(false)}
              variant="outline"
              className="flex-1"
              darkMode={darkMode}
            >
              Back
            </Button>
            <Button
              onClick={handleAuth}
              className="flex-1"
              disabled={!acceptedTerms}
              darkMode={darkMode}
            >
              Create Account
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} darkMode={darkMode}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${
            darkMode ? 'text-emerald-400' : 'text-emerald-600'
          }`}>
            {isSignIn ? "Sign In" : "Create Account"}
          </h2>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <FiX className={darkMode ? "text-gray-400" : "text-gray-600"} />
          </button>
        </div>
        
        <form onSubmit={handleAuth}>
          <div className="mb-4">
            <label className={`block mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
              } ${!emailAvailable && !isSignIn ? 'border-red-500' : ''}`}
              required
            />
            {!emailAvailable && !isSignIn && (
              <p className={`text-xs mt-1 ${
                darkMode ? 'text-red-400' : 'text-red-600'
              }`}>
                Email already registered
              </p>
            )}
          </div>
          
          {!isSignIn && (
            <div className="mb-4">
              <label className={`block mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Username (min 4 characters)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                } ${!usernameAvailable ? 'border-red-500' : ''}`}
                minLength={4}
                required
              />
              {!usernameAvailable && (
                <p className={`text-xs mt-1 ${
                  darkMode ? 'text-red-400' : 'text-red-600'
                }`}>
                  Username already taken
                </p>
              )}
            </div>
          )}
          
          <div className="mb-4">
            <label className={`block mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Password (min 6 characters)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
              }`}
              minLength={6}
              required
            />
          </div>
          
          {!isSignIn && (
            <div className="mb-6">
              <label className={`block mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full p-3 rounded-lg border ${
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
                } ${password && confirmPassword && password !== confirmPassword ? 'border-red-500' : ''}`}
                required
              />
              {password && confirmPassword && password !== confirmPassword && (
                <p className={`text-xs mt-1 ${
                  darkMode ? 'text-red-400' : 'text-red-600'
                }`}>
                  Passwords don't match
                </p>
              )}
            </div>
          )}
          
          {error && (
            <div className={`mb-4 p-3 rounded-lg flex items-start gap-2 ${
              darkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-800'
            }`}>
              <FiAlertCircle className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <Button
            type="submit"
            className={`w-full ${
              !formValid ? (darkMode ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-300 cursor-not-allowed') : ''
            }`}
            disabled={!formValid || loading}
            darkMode={darkMode}
          >
            {loading ? (
              <span className="inline-flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : isSignIn ? "Sign In" : "Create Account"}
          </Button>
        </form>
        
        <p className={`text-center text-sm mt-4 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {isSignIn ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => setAuthType(isSignIn ? "signup" : "signin")}
            className={`font-medium ${
              darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500'
            }`}
          >
            {isSignIn ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </Modal>
  );
}