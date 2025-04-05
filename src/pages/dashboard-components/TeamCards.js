import { useState } from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import Button from "../../components/ui/button";
import { filterOptions, getLogoFilename } from "../Dashboard";
import { useAuth } from "../../context/AuthContext";

export default function TeamCards({
  activeTab,
  darkMode,
  filteredTeams,
  searchQuery,
  setSearchQuery,
  selectedFilter,
  setSelectedFilter,
  setShowAccountSettings,
  handleTeamClick,
  handleRecordPrediction
}) {
  const [hoveredCard, setHoveredCard] = useState(null);
  const { user } = useAuth();

  if (activeTab === "user" && !user) {
    return (
      <div className={`flex-grow p-6 flex flex-col items-center justify-center ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className={`max-w-md p-8 rounded-xl text-center ${
          darkMode ? 'bg-gray-800/50' : 'bg-white'
        }`}>
          <h2 className={`text-xl font-bold mb-4 ${
            darkMode ? 'text-emerald-400' : 'text-emerald-600'
          }`}>
            Sign In to Track Predictions
          </h2>
          <p className={`mb-6 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Create an account or sign in to record and track your NBA predictions.
          </p>
          <Button
            onClick={() => setShowAccountSettings(true)}
            className="w-full"
            darkMode={darkMode}
          >
            Sign In / Register
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hotbar with search and filter */}
      <div className={`sticky top-16 z-40 p-4 ${
        darkMode ? 'bg-gray-800/80 border-b border-gray-700' : 'bg-white border-b border-gray-200'
      } backdrop-blur-sm`}>
        <div className="flex items-center justify-between gap-4">
          <div className={`flex items-center flex-1 max-w-md px-4 py-2 rounded-lg ${
            darkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            <FiSearch className={`mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder={`Search ${activeTab === 'global' ? 'teams' : 'your predictions'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-transparent focus:outline-none ${
                darkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'
              }`}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <FiFilter className={darkMode ? "text-gray-400" : "text-gray-600"} />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className={`px-3 py-2 rounded-lg ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'
              } cursor-pointer`}
            >
              {filterOptions.map(option => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className={`flex-grow p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        {filteredTeams.map((team) => (
          <div
            key={team.name}
            className={`${darkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white border-gray-200'} 
            p-5 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden
            ${hoveredCard === team.name ? 
              'scale-102 -translate-y-1 border-emerald-500/50 shadow-lg shadow-emerald-500/10' : 
              'shadow-md shadow-black/20'}`}
            onClick={() => handleTeamClick(team)}
            onMouseEnter={() => setHoveredCard(team.name)}
            onMouseLeave={() => setHoveredCard(null)}
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
              <h2 className={`text-xl font-bold mb-2 ${
                darkMode ? 'text-emerald-400' : 'text-emerald-600'
              }`}>{team.name}</h2>
              
              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className={`${darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-100 text-gray-600'} p-2 rounded`}>
                  <p>{activeTab === "global" ? "Win Rate" : "Your WR"}</p>
                  <p className={`font-semibold ${
                    darkMode ? 'text-emerald-400' : 'text-emerald-600'
                  }`}>
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
                  <p>Rank</p>
                  <p className="font-semibold">#{team.rank || 'N/A'}</p>
                </div>
              </div>
              
              {activeTab === "user" && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRecordPrediction(team);
                  }}
                  className="w-full mt-4"
                  darkMode={darkMode}
                >
                  Record Prediction
                </Button>
              )}
            </div>
            
            {/* Pulse effect when hovered */}
            {hoveredCard === team.name && (
              <div className={`absolute inset-0 rounded-xl border-2 ${
                darkMode ? 'border-emerald-500/30' : 'border-emerald-400/30'
              } pointer-events-none animate-ping-slow`}></div>
            )}
          </div>
        ))}
      </main>
    </>
  );
}