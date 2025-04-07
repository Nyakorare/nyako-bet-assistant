import { useState } from "react";
import Button from "../../components/ui/button";
import { FiSun, FiMoon, FiUser, FiSettings, FiLogOut, FiChevronDown } from "react-icons/fi";
import AuthModal from "./AuthModal";
import AccountSettingsModal from "./AccountSettingsModal";
import { useAuth } from "../../context/AuthContext";

export default function DashboardHeader({ activeTab, setActiveTab, darkMode, toggleDarkMode }) {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [authType, setAuthType] = useState("signin");
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const handleAuthClick = (type) => {
    setAuthType(type);
    setShowAuthModal(true);
  };

  if (user === undefined) {
    return (
      <header className={`flex justify-between items-center p-4 ${
        darkMode ? 'bg-gray-800 border-b border-emerald-500/20' : 'bg-white border-b border-emerald-500/30'
      } sticky top-0 z-50 transition-all duration-300`}>
        {/* Loading state */}
      </header>
    );
  }

  return (
    <>
      <header className={`flex justify-between items-center p-4 ${
        darkMode ? 'bg-gray-800 border-b border-emerald-500/20' : 'bg-white border-b border-emerald-500/30'
      } sticky top-0 z-50 transition-all duration-300`}>
        <div className="flex items-center gap-2">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-12 transition-transform duration-300 hover:rotate-6"
          />
          <div className="flex items-center gap-2">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                NBA
              </h1>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nyako Bet Assistant</p>
            </div>
            <button 
              onClick={toggleDarkMode}
              className={`ml-2 p-2 rounded-full ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
              } transition-colors duration-300`}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <FiSun className="text-yellow-300" /> : <FiMoon className="text-indigo-600" />}
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-4">
          <Button
            onClick={() => setActiveTab("global")}
            variant={activeTab === "global" ? "default" : "outline"}
            className="transition-all duration-300 hover:scale-105 active:scale-95"
            darkMode={darkMode}
          >
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Global Stats
            </span>
          </Button>
          <Button
            onClick={() => setActiveTab("user")}
            variant={activeTab === "user" ? "default" : "outline"}
            className="transition-all duration-300 hover:scale-105 active:scale-95"
            darkMode={darkMode}
          >
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              User Stats
            </span>
          </Button>
        </div>
        
        {/* Auth section */}
        <div className="flex gap-2 relative">
          {user ? (
            <div className="relative">
              <Button 
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                variant="secondary" 
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium transition-all hover:scale-105 active:scale-95"
                darkMode={darkMode}
              >
                <FiUser />
                <span>{user.user_metadata?.username || user.email.split('@')[0]}</span>
                <FiChevronDown className={`transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
              </Button>
              
              {showUserDropdown && (
                <div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 ${
                  darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
                } z-50`}>
                  <div className={`px-4 py-2 text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {user.user_metadata?.username || user.email.split('@')[0]}
                  </div>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      setShowAccountSettings(true);
                    }}
                    className={`flex w-full px-4 py-2 text-sm items-center gap-2 ${
                      darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <FiSettings className="text-emerald-500" />
                    Account Settings
                  </button>
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      signOut();
                    }}
                    className={`flex w-full px-4 py-2 text-sm items-center gap-2 ${
                      darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-600 hover:bg-gray-100'
                    }`}
                  >
                    <FiLogOut className="text-red-500" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button 
                onClick={() => handleAuthClick("signin")}
                variant="secondary" 
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium transition-all hover:scale-105 active:scale-95"
                darkMode={darkMode}
              >
                Sign In
              </Button>
              <Button 
                onClick={() => handleAuthClick("signup")}
                variant="secondary" 
                className="bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-medium transition-all hover:scale-105 active:scale-95"
                darkMode={darkMode}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          darkMode={darkMode}
          type={authType}
        />
      )}

      {/* Account Settings Modal */}
      {showAccountSettings && (
        <AccountSettingsModal 
          isOpen={showAccountSettings}
          onClose={() => setShowAccountSettings(false)}
          darkMode={darkMode}
        />
      )}
    </>
  );
}