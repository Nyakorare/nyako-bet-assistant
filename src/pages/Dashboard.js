import { useState } from "react";
import { nbaTeams } from "../components/data/nbaTeams";
import Button from "../components/ui/button";
import { FiSun, FiMoon, FiX, FiCheck, FiTrendingUp, FiTrendingDown, FiUser, FiDollarSign, FiSearch, FiFilter, FiSettings } from "react-icons/fi";
import Modal from "../components/ui/modal";

import { useAuth } from '../hooks/useAuth';
import AuthModal from './auth/AuthModal';

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

// Filter options
const filterOptions = [
  { id: 'highest-wins', label: 'Highest Wins' },
  { id: 'highest-losses', label: 'Highest Losses' },
  { id: 'highest-wr', label: 'Highest Win Rate' },
  { id: 'lowest-wr', label: 'Lowest Win Rate' },
  { id: 'highest-profit', label: 'Highest Profit' },
  { id: 'lowest-profit', label: 'Lowest Profit' }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("global");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [showTeamStatsModal, setShowTeamStatsModal] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [predictionType, setPredictionType] = useState(null);
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [expandedPrediction, setExpandedPrediction] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("highest-wr");
  const [betAmount, setBetAmount] = useState("");
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('signin'); // 'signin' or 'signup'
  const { user, loading: authLoading, signOut } = useAuth();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    if (activeTab === "user") {
      setShowPredictionModal(true);
    } else {
      setShowTeamStatsModal(true);
    }
  };

  const handlePredictionSubmit = () => {
    // Determine the opposite team and prediction
    const oppositeTeam = nbaTeams.find(t => t.name === selectedOpponent);
    const oppositePrediction = expandedPrediction === 'for' ? 'against' : 'for';
    
    // Here you would typically send both predictions to your backend
    console.log("Primary bet:", {
      team: selectedTeam.name,
      prediction: predictionType,
      opponent: selectedOpponent,
      betType: expandedPrediction,
      amount: betAmount
    });
    
    console.log("Opposite bet (automatically recorded):", {
      team: oppositeTeam.name,
      prediction: predictionType === 'win' ? 'lose' : 'win', // Invert prediction for opposite team
      opponent: selectedTeam.name,
      betType: oppositePrediction,
      amount: betAmount
    });
    
    // Reset and close modal
    setPredictionType(null);
    setSelectedOpponent(null);
    setExpandedPrediction(null);
    setBetAmount("");
    setShowPredictionModal(false);
  };

  // Filter and sort teams based on search and filter options
  const filteredTeams = nbaTeams
    .filter(team => 
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.name.split(' ').pop().toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (selectedFilter) {
        case 'highest-wins':
          return (b.userWins || 0) - (a.userWins || 0);
        case 'highest-losses':
          return (b.userLosses || 0) - (a.userLosses || 0);
        case 'highest-wr':
          return (b.userWr || b.wr || 0) - (a.userWr || a.wr || 0);
        case 'lowest-wr':
          return (a.userWr || a.wr || 0) - (b.userWr || b.wr || 0);
        case 'highest-profit':
          return (b.netProfit || 0) - (a.netProfit || 0);
        case 'lowest-profit':
          return (a.netProfit || 0) - (b.netProfit || 0);
        default:
          return (b.userWr || b.wr || 0) - (a.userWr || a.wr || 0);
      }
    });

  const renderTeamStatsModal = () => {
    if (!selectedTeam) return null;
    
    return (
      <Modal isOpen={showTeamStatsModal} onClose={() => setShowTeamStatsModal(false)} darkMode={darkMode}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img 
                src={`/logos/${getLogoFilename(selectedTeam.name)}.png`}
                alt={selectedTeam.name}
                className="h-16 w-16"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/logos/default.png";
                }}
              />
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                {selectedTeam.name} Statistics
              </h2>
            </div>
            <button 
              onClick={() => setShowTeamStatsModal(false)}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <FiX className={darkMode ? "text-gray-400" : "text-gray-600"} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <h3 className={`flex items-center gap-2 text-lg font-semibold mb-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                <FiTrendingUp /> Wins Analysis
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <FiUser /> User Wins Betting For This Team
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedTeam.userWinsFor?.length > 0 ? (
                      selectedTeam.userWinsFor.map((win, index) => (
                        <div key={index} className={`p-2 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-200'}`}>
                          <p className="text-sm">vs {win.opponent}</p>
                          <p className="text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}">+${win.amount}</p>
                        </div>
                      ))
                    ) : (
                      <p className={`col-span-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No user wins recorded</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <FiDollarSign /> User Wins Against For This Team
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedTeam.winsAgainst?.length > 0 ? (
                      selectedTeam.winsAgainst.map((team, index) => (
                        <div key={index} className={`p-2 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-200'}`}>
                          <p className="text-sm">vs {team}</p>
                          <p className="text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}">Score: {team.score}</p>
                        </div>
                      ))
                    ) : (
                      <p className={`col-span-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No wins recorded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <h3 className={`flex items-center gap-2 text-lg font-semibold mb-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                <FiTrendingDown /> Losses Analysis
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <FiUser /> User Losses Betting For This Team
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedTeam.userLossesAgainst?.length > 0 ? (
                      selectedTeam.userLossesAgainst.map((loss, index) => (
                        <div key={index} className={`p-2 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-200'}`}>
                          <p className="text-sm">vs {loss.opponent}</p>
                          <p className="text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}">-${loss.amount}</p>
                        </div>
                      ))
                    ) : (
                      <p className={`col-span-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No user losses recorded</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <FiDollarSign /> User Losses Betting Against This Team
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedTeam.lossesAgainst?.length > 0 ? (
                      selectedTeam.lossesAgainst.map((team, index) => (
                        <div key={index} className={`p-2 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-200'}`}>
                          <p className="text-sm">vs {team}</p>
                          <p className="text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}">Score: {team.score}</p>
                        </div>
                      ))
                    ) : (
                      <p className={`col-span-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No losses recorded</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <h3 className="text-lg font-semibold mb-4">Betting Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>User Win Rate</p>
                <p className={`text-xl font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {selectedTeam.userWr || 'N/A'}
                </p>
              </div>
              <div className="text-center">
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>User Wins</p>
                <p className="text-xl font-bold">{selectedTeam.userWins || '0'}</p>
              </div>
              <div className="text-center">
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>User Losses</p>
                <p className="text-xl font-bold">{selectedTeam.userLosses || '0'}</p>
              </div>
              <div className="text-center">
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Net Profit</p>
                <p className={`text-xl font-bold ${
                  (selectedTeam.netProfit || 0) >= 0 ? 
                    (darkMode ? 'text-emerald-400' : 'text-emerald-600') : 
                    (darkMode ? 'text-red-400' : 'text-red-600')
                }`}>
                  ${selectedTeam.netProfit || '0'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  };

  const renderPredictionModal = () => {
    if (!selectedTeam) return null;
    
    return (
      <Modal isOpen={showPredictionModal} onClose={() => setShowPredictionModal(false)} darkMode={darkMode}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <img 
                src={`/logos/${getLogoFilename(selectedTeam.name)}.png`}
                alt={selectedTeam.name}
                className="h-16 w-16"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/logos/default.png";
                }}
              />
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Place Your Bet
              </h2>
            </div>
            <button 
              onClick={() => setShowPredictionModal(false)}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <FiX className={darkMode ? "text-gray-400" : "text-gray-600"} />
            </button>
          </div>
          
          {!predictionType ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Will they win or lose?</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => setPredictionType('win')}
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  variant="outline"
                  darkMode={darkMode}
                >
                  <FiCheck className="text-green-500 text-2xl" />
                  <span>Win</span>
                </Button>
                <Button
                  onClick={() => setPredictionType('lose')}
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  variant="outline"
                  darkMode={darkMode}
                >
                  <FiX className="text-red-500 text-2xl" />
                  <span>Lose</span>
                </Button>
              </div>
            </div>
          ) : !selectedOpponent ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full ${predictionType === 'win' ? 
                  (darkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800') : 
                  (darkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-800')}`}>
                  {predictionType === 'win' ? 'Win prediction' : 'Lose prediction'}
                </span>
                <button 
                  onClick={() => setPredictionType(null)}
                  className={`text-sm ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  Change
                </button>
              </div>
              
              <h3 className="text-lg font-semibold">Who are they playing against?</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {nbaTeams
                  .filter(team => team.name !== selectedTeam.name)
                  .map(team => (
                    <button
                      key={team.name}
                      onClick={() => setSelectedOpponent(team.name)}
                      className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                        selectedOpponent === team.name ? 
                          (darkMode ? 'bg-emerald-800/50 border-emerald-500' : 'bg-emerald-100 border-emerald-400') : 
                          (darkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-white hover:bg-gray-50 border-gray-200')
                      } border`}
                    >
                      <img 
                        src={`/logos/${getLogoFilename(team.name)}.png`}
                        alt={team.name}
                        className="h-8 w-8 mb-1"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/logos/default.png";
                        }}
                      />
                      <span className="text-xs text-center">{team.name.split(' ').pop()}</span>
                    </button>
                  ))}
              </div>
            </div>
          ) : !expandedPrediction ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full ${predictionType === 'win' ? 
                  (darkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800') : 
                  (darkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-800')}`}>
                  {predictionType === 'win' ? 'Win prediction' : 'Lose prediction'}
                </span>
                <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800'}`}>
                  vs {selectedOpponent.split(' ').pop()}
                </span>
                <button 
                  onClick={() => setSelectedOpponent(null)}
                  className={`text-sm ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  Change
                </button>
              </div>
              
              <h3 className="text-lg font-semibold">Your Bet Type</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => setExpandedPrediction(predictionType === 'win' ? 'for' : 'against')}
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  variant="outline"
                  darkMode={darkMode}
                >
                  {predictionType === 'win' ? (
                    <>
                      <FiTrendingUp className="text-green-500 text-2xl" />
                      <span>Betting FOR {selectedTeam.name.split(' ').pop()}</span>
                    </>
                  ) : (
                    <>
                      <FiTrendingDown className="text-red-500 text-2xl" />
                      <span>Betting AGAINST {selectedTeam.name.split(' ').pop()}</span>
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setExpandedPrediction(predictionType === 'win' ? 'against' : 'for')}
                  className="h-20 flex flex-col items-center justify-center gap-2"
                  variant="outline"
                  darkMode={darkMode}
                >
                  {predictionType === 'win' ? (
                    <>
                      <FiTrendingDown className="text-red-500 text-2xl" />
                      <span>Betting AGAINST {selectedOpponent.split(' ').pop()}</span>
                    </>
                  ) : (
                    <>
                      <FiTrendingUp className="text-green-500 text-2xl" />
                      <span>Betting FOR {selectedOpponent.split(' ').pop()}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full ${predictionType === 'win' ? 
                  (darkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800') : 
                  (darkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-800')}`}>
                  {predictionType === 'win' ? 'Win prediction' : 'Lose prediction'}
                </span>
                <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800'}`}>
                  vs {selectedOpponent.split(' ').pop()}
                </span>
                <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-800'}`}>
                  {expandedPrediction === 'for' ? 'FOR' : 'AGAINST'}
                </span>
                <button 
                  onClick={() => setExpandedPrediction(null)}
                  className={`text-sm ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  Change
                </button>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-3">Bet Amount</h3>
                <input
                  type="number"
                  placeholder="$ Enter amount"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    darkMode ? 'bg-gray-800 border-gray-700 focus:border-emerald-500' : 
                    'bg-white border-gray-300 focus:border-emerald-400'
                  } focus:outline-none focus:ring-2 ${
                    darkMode ? 'focus:ring-emerald-500/50' : 'focus:ring-emerald-400/50'
                  }`}
                />
              </div>
              
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800/50' : 'bg-gray-100'} mb-4`}>
                <h4 className="font-medium mb-2">Note:</h4>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  This will automatically record a corresponding bet for the opposing team with the opposite prediction.
                </p>
              </div>
              
              <Button
                onClick={handlePredictionSubmit}
                className="w-full mt-2"
                darkMode={darkMode}
              >
                Confirm Bet
              </Button>
            </div>
          )}
        </div>
      </Modal>
    );
  };

  const renderAccountSettingsModal = () => {
    return (
      <Modal isOpen={showAccountSettings} onClose={() => setShowAccountSettings(false)} darkMode={darkMode}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              Account Settings
            </h2>
            <button 
              onClick={() => setShowAccountSettings(false)}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <FiX className={darkMode ? "text-gray-400" : "text-gray-600"} />
            </button>
          </div>
          
          <div className="space-y-4">
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
                placeholder="Enter new username"
              />
            </div>
            
            <div>
              <label className={`block mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
              <input
                type="email"
                className={`w-full p-3 rounded-lg border ${
                  darkMode ? 'bg-gray-800 border-gray-700 focus:border-emerald-500' : 
                  'bg-white border-gray-300 focus:border-emerald-400'
                } focus:outline-none focus:ring-2 ${
                  darkMode ? 'focus:ring-emerald-500/50' : 'focus:ring-emerald-400/50'
                }`}
                placeholder="Enter new email"
              />
            </div>
            
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
                placeholder="Enter new password"
              />
            </div>
            
            <Button
              onClick={() => setShowAccountSettings(false)}
              className="w-full mt-6"
              darkMode={darkMode}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    );
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
        
        <div className="flex gap-2">
          {user ? (
            <Button 
              onClick={signOut}
              variant="secondary" 
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium transition-all hover:scale-105 active:scale-95"
              darkMode={darkMode}
            >
              Sign Out
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => {
                  setShowAuthModal(true);
                  setAuthMode('signin');
                }}
                variant="secondary" 
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium transition-all hover:scale-105 active:scale-95"
                darkMode={darkMode}
              >
                Sign In
              </Button>
              <Button 
                onClick={() => {
                  setShowAuthModal(true);
                  setAuthMode('signup');
                }}
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

      {/* Hotbar with search and filter */}
      <div className={`sticky top-16 z-40 p-4 ${darkMode ? 'bg-gray-800/80 border-b border-gray-700' : 'bg-white border-b border-gray-200'} backdrop-blur-sm`}>
        <div className="flex items-center justify-between gap-4">
          <div className={`flex items-center flex-1 max-w-md px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <FiSearch className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'global' ? 'teams' : 'your bets'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-transparent focus:outline-none ${darkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'}`}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <FiFilter className={darkMode ? "text-gray-400" : "text-gray-600"} />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className={`px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'} cursor-pointer`}
            >
              {filterOptions.map(option => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>
          
          {activeTab === "user" && (
            <button 
              onClick={() => setShowAccountSettings(true)}
              className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            >
              <FiSettings className={darkMode ? "text-gray-400" : "text-gray-600"} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className={`flex-grow p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {filteredTeams.map((team) => (
          <div
            key={team.name}
            onMouseEnter={() => setHoveredCard(team.name)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => handleTeamClick(team)}
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
                  <p>{activeTab === "global" ? "Win Rate" : "Your WR"}</p>
                  <p className={`font-semibold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    {activeTab === "global" ? team.wr : team.userWr || 'N/A'}
                  </p>
                </div>
                <div className={`${darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-600'} p-2 rounded`}>
                  <p>{activeTab === "global" ? "Wins" : "Your Wins"}</p>
                  <p className="font-semibold">{activeTab === "global" ? team.wins : team.userWins || '0'}</p>
                </div>
                <div className={`${darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-600'} p-2 rounded`}>
                  <p>{activeTab === "global" ? "Losses" : "Your Losses"}</p>
                  <p className="font-semibold">{activeTab === "global" ? team.losses : team.userLosses || '0'}</p>
                </div>
                <div className={`${darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-600'} p-2 rounded`}>
                  <p>{activeTab === "global" ? "Rank" : "Net Profit"}</p>
                  <p className={`font-semibold ${
                    activeTab === "global" ? '' : 
                    (team.netProfit || 0) >= 0 ? (darkMode ? 'text-emerald-400' : 'text-emerald-600') : 
                    (darkMode ? 'text-red-400' : 'text-red-600')
                  }`}>
                    {activeTab === "global" ? `#${team.rank || 'N/A'}` : `$${team.netProfit || '0'}`}
                  </p>
                </div>
              </div>
              
              {activeTab === "user" && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTeam(team);
                    setShowPredictionModal(true);
                  }}
                  className="w-full mt-4"
                  darkMode={darkMode}
                >
                  Place Your Result
                </Button>
              )}
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

      {/* Modals */}
      {showPredictionModal && renderPredictionModal()}
      {showTeamStatsModal && renderTeamStatsModal()}
      {showAccountSettings && renderAccountSettingsModal()}

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