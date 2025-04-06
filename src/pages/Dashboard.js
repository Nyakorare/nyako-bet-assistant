import { useState, useEffect } from "react";
import Button from "../components/ui/button";
import { FiFilter } from "react-icons/fi";
import { nbaTeams } from "../components/data/nbaTeams";
import DashboardHeader from "./dashboard-components/DashboardHeader";
import TeamCards from "./dashboard-components/TeamCards";
import TeamStatsModal from "./dashboard-components/TeamStatsModal";
import PredictionModal from "./dashboard-components/PredictionModal";
import AccountSettingsModal from "./dashboard-components/AccountSettingsModal";
import DashboardFooter from "./dashboard-components/DashboardFooter";
import AuthModal from "./dashboard-components/AuthModal";
import TermsModal from "./dashboard-components/TermsModal";
import HistoryTab from "./dashboard-components/HistoryTab";
import { useAuth } from "../context/AuthContext";

export const getLogoFilename = (teamName) => {
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

export const filterOptions = [
  { id: 'highest-wins', label: 'Highest Wins' },
  { id: 'highest-losses', label: 'Highest Losses' },
  { id: 'highest-wr', label: 'Highest Win Rate' },
  { id: 'lowest-wr', label: 'Lowest Win Rate' }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("global");
  const [contentTab, setContentTab] = useState("teams");
  const [darkMode, setDarkMode] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [showTeamStatsModal, setShowTeamStatsModal] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("highest-wr");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState("signin");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [globalStats, setGlobalStats] = useState({});
  const [userStats, setUserStats] = useState({});
  const { user, getTeamPredictions, getUserPredictions, getGlobalStats } = useAuth();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    setShowTeamStatsModal(true);
  };

  const handleRecordPrediction = (team, authAction) => {
    if (authAction) {
      setAuthType(authAction);
      setShowAuthModal(true);
      return;
    }
    setSelectedTeam(team);
    setShowPredictionModal(true);
  };

  useEffect(() => {
    const fetchStats = async () => {
      const stats = {};
      
      // Get all predictions from the database
      const { data: allPredictions } = await getGlobalStats();
      
      nbaTeams.forEach(team => {
        const teamPreds = allPredictions?.filter(p => p.team_name === team.name) || [];
        const winsFor = teamPreds.filter(p => p.outcome === true && p.bet_type === 'for').length;
        const winsAgainst = teamPreds.filter(p => p.outcome === true && p.bet_type === 'against').length;
        const lossesFor = teamPreds.filter(p => p.outcome === false && p.bet_type === 'for').length;
        const lossesAgainst = teamPreds.filter(p => p.outcome === false && p.bet_type === 'against').length;
        const total = winsFor + winsAgainst + lossesFor + lossesAgainst;
        
        stats[team.name] = {
          wins: winsFor + winsAgainst,
          losses: lossesFor + lossesAgainst,
          winsFor,
          winsAgainst,
          lossesFor,
          lossesAgainst,
          wr: total > 0 ? `${Math.round(((winsFor + winsAgainst) / total) * 100)}%` : '0%'
        };
      });

      // Calculate ranks
      const rankedTeams = Object.entries(stats)
        .sort(([, a], [, b]) => parseFloat(b.wr) - parseFloat(a.wr));
      
      rankedTeams.forEach(([teamName], index) => {
        stats[teamName].rank = index + 1;
      });

      setGlobalStats(stats);
    };

    const fetchUserStats = async () => {
      if (!user) return;
      
      const stats = {};
      const { data } = await getUserPredictions();
      
      nbaTeams.forEach(team => {
        const teamPreds = data?.filter(p => p.team_name === team.name) || [];
        const winsFor = teamPreds.filter(p => p.outcome === true && p.bet_type === 'for').length;
        const winsAgainst = teamPreds.filter(p => p.outcome === true && p.bet_type === 'against').length;
        const lossesFor = teamPreds.filter(p => p.outcome === false && p.bet_type === 'for').length;
        const lossesAgainst = teamPreds.filter(p => p.outcome === false && p.bet_type === 'against').length;
        const total = winsFor + winsAgainst + lossesFor + lossesAgainst;
        
        stats[team.name] = {
          wins: winsFor + winsAgainst,
          losses: lossesFor + lossesAgainst,
          winsFor,
          winsAgainst,
          lossesFor,
          lossesAgainst,
          wr: total > 0 ? `${Math.round(((winsFor + winsAgainst) / total) * 100)}%` : 'N/A'
        };
      });

      setUserStats(stats);
    };

    if (activeTab === 'global') {
      fetchStats();
    } else {
      fetchUserStats();
    }
  }, [activeTab, user, showPredictionModal, getGlobalStats, getUserPredictions]);

  const filteredTeams = nbaTeams
    .map(team => ({
      ...team,
      ...(activeTab === 'global' ? globalStats[team.name] : userStats[team.name]),
      rank: activeTab === 'global' ? globalStats[team.name]?.rank : undefined
    }))
    .filter(team => 
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.name.split(' ').pop().toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const aWins = a.wins || 0;
      const bWins = b.wins || 0;
      const aLosses = a.losses || 0;
      const bLosses = b.losses || 0;
      const aWr = parseFloat(a.wr) || 0;
      const bWr = parseFloat(b.wr) || 0;

      switch (selectedFilter) {
        case 'highest-wins': return bWins - aWins;
        case 'highest-losses': return bLosses - aLosses;
        case 'highest-wr': return bWr - aWr;
        case 'lowest-wr': return aWr - bWr;
        default: return bWr - aWr;
      }
    });

  const renderContent = () => {
    if (activeTab === "global") {
      return (
        <TeamCards 
          activeTab={activeTab}
          darkMode={darkMode}
          filteredTeams={filteredTeams}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          handleTeamClick={handleTeamClick}
          onRecordPrediction={handleRecordPrediction}
        />
      );
    }

    switch (contentTab) {
      case "teams":
        return (
          <TeamCards 
            activeTab={activeTab}
            darkMode={darkMode}
            filteredTeams={filteredTeams}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            handleTeamClick={handleTeamClick}
            onRecordPrediction={handleRecordPrediction}
          />
        );
      case "players":
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
                Players Feature Coming Soon
              </h2>
              <p className={`mb-6 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                I am working on adding player statistics and predictions. Check back later!
              </p>
            </div>
          </div>
        );
      case "history":
        return <HistoryTab darkMode={darkMode} />;
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <DashboardHeader 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      {activeTab === "user" && (
        <div className={`sticky top-16 z-40 p-4 ${
          darkMode ? 'bg-gray-800/80 border-b border-gray-700' : 'bg-white border-b border-gray-200'
        } backdrop-blur-sm`}>
          <div className="flex items-center justify-between gap-4">
            <div className={`flex items-center flex-1 max-w-md px-4 py-2 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <input
                type="text"
                placeholder="Search your predictions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-transparent focus:outline-none ${
                  darkMode ? 'placeholder-gray-500' : 'placeholder-gray-400'
                }`}
              />
            </div>
            
            {user ? (
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setContentTab("teams")}
                  variant={contentTab === "teams" ? "default" : "outline"}
                  darkMode={darkMode}
                >
                  Teams
                </Button>
                <Button
                  onClick={() => setContentTab("players")}
                  variant={contentTab === "players" ? "default" : "outline"}
                  darkMode={darkMode}
                >
                  Players
                </Button>
                <Button
                  onClick={() => setContentTab("history")}
                  variant={contentTab === "history" ? "default" : "outline"}
                  darkMode={darkMode}
                >
                  History
                </Button>
                <div className="flex items-center gap-2 ml-2">
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
            ) : (
              <div className="text-sm italic text-gray-500">
                Sign in to access user features
              </div>
            )}
          </div>
        </div>
      )}

      {renderContent()}

      <DashboardFooter 
        darkMode={darkMode} 
        onShowTerms={() => setShowTermsModal(true)}
      />

      {/* Modals */}
      {showPredictionModal && (
        <PredictionModal 
          isOpen={showPredictionModal}
          onClose={() => setShowPredictionModal(false)}
          darkMode={darkMode}
          selectedTeam={selectedTeam}
          nbaTeams={nbaTeams}
        />
      )}
      
      {showTeamStatsModal && (
        <TeamStatsModal 
          isOpen={showTeamStatsModal}
          onClose={() => setShowTeamStatsModal(false)}
          darkMode={darkMode}
          selectedTeam={selectedTeam}
          activeTab={activeTab}
          onRecordPrediction={handleRecordPrediction}
        />
      )}
      
      {showAccountSettings && (
        <AccountSettingsModal 
          isOpen={showAccountSettings}
          onClose={() => setShowAccountSettings(false)}
          darkMode={darkMode}
        />
      )}

      {showTermsModal && (
        <TermsModal 
          isOpen={showTermsModal}
          onClose={() => setShowTermsModal(false)}
          darkMode={darkMode}
        />
      )}

      {showAuthModal && (
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          darkMode={darkMode}
          type={authType}
        />
      )}
    </div>
  );
}