import { useState } from "react";
import { FiX } from "react-icons/fi";
import Modal from "../../components/ui/modal";
import Button from "../../components/ui/button";

export default function AuthModal({ isOpen, onClose, darkMode, type }) {
  const [authType, setAuthType] = useState(type);
  const isSignIn = authType === "signin";

  return (
    <Modal isOpen={isOpen} onClose={onClose} darkMode={darkMode}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-2xl font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            {isSignIn ? "Sign In" : "Create Account"}
          </h2>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <FiX className={darkMode ? "text-gray-400" : "text-gray-600"} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {isSignIn ? "Email or Username" : "Email"}
            </label>
            <input
              type={isSignIn ? "text" : "email"}
              className={`w-full p-3 rounded-lg border ${
                darkMode ? 'bg-gray-800 border-gray-700 focus:border-emerald-500' : 
                'bg-white border-gray-300 focus:border-emerald-400'
              } focus:outline-none focus:ring-2 ${
                darkMode ? 'focus:ring-emerald-500/50' : 'focus:ring-emerald-400/50'
              }`}
              placeholder={isSignIn ? "Enter your email or username" : "Enter your email"}
            />
          </div>
          
          {!isSignIn && (
            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Username</label>
              <input
                type="text"
                className={`w-full p-3 rounded-lg border ${
                  darkMode ? 'bg-gray-800 border-gray-700 focus:border-emerald-500' : 
                  'bg-white border-gray-300 focus:border-emerald-400'
                } focus:outline-none focus:ring-2 ${
                  darkMode ? 'focus:ring-emerald-500/50' : 'focus:ring-emerald-400/50'
                }`}
                placeholder="Choose a username"
              />
            </div>
          )}
          
          <div>
            <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
            <input
              type="password"
              className={`w-full p-3 rounded-lg border ${
                darkMode ? 'bg-gray-800 border-gray-700 focus:border-emerald-500' : 
                'bg-white border-gray-300 focus:border-emerald-400'
              } focus:outline-none focus:ring-2 ${
                darkMode ? 'focus:ring-emerald-500/50' : 'focus:ring-emerald-400/50'
              }`}
              placeholder="Enter your password"
            />
          </div>
          
          {!isSignIn && (
            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm Password</label>
              <input
                type="password"
                className={`w-full p-3 rounded-lg border ${
                  darkMode ? 'bg-gray-800 border-gray-700 focus:border-emerald-500' : 
                  'bg-white border-gray-300 focus:border-emerald-400'
                } focus:outline-none focus:ring-2 ${
                  darkMode ? 'focus:ring-emerald-500/50' : 'focus:ring-emerald-400/50'
                }`}
                placeholder="Confirm your password"
              />
            </div>
          )}
          
          <Button
            className="w-full mt-4"
            darkMode={darkMode}
          >
            {isSignIn ? "Sign In" : "Create Account"}
          </Button>
          
          <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {isSignIn ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => setAuthType(isSignIn ? "signup" : "signin")}
              className={`font-medium ${darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500'}`}
            >
              {isSignIn ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
}