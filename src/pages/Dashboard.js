import { useState } from "react";
import { nbaTeams } from "../components/data/nbaTeams";
import Button from "../components/ui/button";
import { FiSun, FiMoon } from "react-icons/fi";

// Helper function to get logo filename
const getLogoFilename = (teamName) => {
  const specialCases = {
    "Portland Trail Blazers": "blazers",
    "Oklahoma City Thunder": "okc",
    "New Orleans Pelicans": "pelicans",
    "San Antonio Spurs": "spurs",
    "Golden State Warriors": "warriors",
    "Los Angeles Lakers": "lakers",
    "LA Clippers": "clippers",
    "New York Knicks": "knicks",
    "Toronto Raptors": "raptors",
    "Utah Jazz": "jazz",
    "Philadelphia 76ers": "sixers"
  };
  
  return specialCases[teamName] || teamName.split(' ').pop().toLowerCase();
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("global");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`flex justify-between items-center p-4 ${darkMode ? 'bg-gray-800 border-b border-emerald-500/20' : 'bg-white border-b border-emerald-500/30'} sticky top-0 z-50 transition-all duration-300`}>
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
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Nyako Betting Assistant</p>
            </div>
            <button 
              onClick={toggleDarkMode}
              className={`ml-2 p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors duration-300`}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <FiSun className="text-yellow-300" /> : <FiMoon className="text-indigo-600" />}
            </button>
          </div>
        </div>
        
        <div className="flex gap-4">
          <Button
            onClick={() => setActiveTab("global")}
            variant={activeTab === "global" ? "default" : "outline"}
            className="transition-all duration-300 hover:scale-105 active:scale-95"
            darkMode={darkMode}
          >
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Global Predictions
            </span>
          </Button>
          <Button
            onClick={() => setActiveTab("user")}
            variant={activeTab === "user" ? "default" : "outline"}
            className="transition-all duration-300 hover:scale-105 active:scale-95"
            darkMode={darkMode}
          >
            <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              User Predictions
            </span>
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium transition-all hover:scale-105 active:scale-95"
            darkMode={darkMode}
          >
            Sign In
          </Button>
          <Button 
            variant="secondary" 
            className="bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 text-white font-medium transition-all hover:scale-105 active:scale-95"
            darkMode={darkMode}
          >
            Sign Up
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className={`flex-grow p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {nbaTeams.map((team) => (
          <div
            key={team.name}
            onMouseEnter={() => setHoveredCard(team.name)}
            onMouseLeave={() => setHoveredCard(null)}
            className={`${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-200'} p-5 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden
              ${hoveredCard === team.name ? 
                'scale-102 -translate-y-1 border-emerald-500/50 shadow-lg shadow-emerald-500/10' : 
                'shadow-md shadow-black/20'}
              ${darkMode && hoveredCard === team.name ? 'bg-gray-800' : !darkMode && hoveredCard === team.name ? 'bg-gray-50' : ''}`}
          >
            {/* Team logo */}
            <div className="relative">
              <img 
                src={`/logos/${getLogoFilename(team.name)}.png`}
                alt={team.name}
                className={`h-20 w-20 mx-auto mb-4 transition-transform duration-300 
                  ${hoveredCard === team.name ? 'rotate-6' : ''}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/logos/default.png";
                }}
              />
              {hoveredCard === team.name && (
                <div className="shine-effect absolute inset-0 bg-emerald-500/10 pointer-events-none"></div>
              )}
            </div>
            
            <div className="text-center">
              <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{team.name}</h2>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className={`${darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-600'} p-2 rounded`}>
                  <p>Win Rate</p>
                  <p className={`font-semibold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>{team.wr}</p>
                </div>
                <div className={`${darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-600'} p-2 rounded`}>
                  <p>Wins</p>
                  <p className="font-semibold">{team.wins}</p>
                </div>
                <div className={`${darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-600'} p-2 rounded`}>
                  <p>Losses</p>
                  <p className="font-semibold">{team.losses}</p>
                </div>
                <div className={`${darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-600'} p-2 rounded`}>
                  <p>Rank</p>
                  <p className="font-semibold">#{team.rank || 'N/A'}</p>
                </div>
              </div>
            </div>
            
            {/* Pulse effect when hovered */}
            {hoveredCard === team.name && (
              <div className={`absolute inset-0 rounded-xl border-2 ${darkMode ? 'border-emerald-500/30' : 'border-emerald-400/30'} pointer-events-none animate-ping-slow`}></div>
            )}
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className={`${darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-200'} text-center p-4 text-sm border-t transition-opacity duration-300`}>
        <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>&copy; 2025 Nyakorare. All Rights Reserved.</p>
        <p className="mt-2">
          <a href="#" className={`${darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500'} transition-colors duration-300 underline`}>
            Privacy Policy
          </a> 
          <span className={`mx-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>|</span>
          <a href="#" className={`${darkMode ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500'} transition-colors duration-300 underline`}>
            Terms of Service
          </a>
        </p>
      </footer>

      {/* Add custom animation styles in the global CSS or a style tag */}
      <style jsx>{`
        .shine-effect {
          transform: translateX(-100%);
          animation: shine 1.5s infinite;
        }
        
        @keyframes shine {
          0% { transform: translateX(-100%); }
          20% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-ping-slow {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        @keyframes ping {
          0% { transform: scale(1); opacity: 0.7; }
          70%, 100% { transform: scale(1.05); opacity: 0; }
        }
      `}</style>
    </div>
  );
}