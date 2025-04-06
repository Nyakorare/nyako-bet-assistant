import { useState, useEffect } from "react";
import { nbaTeams } from "../components/data/nbaTeams";
import DashboardHeader from "./dashboard-components/DashboardHeader";
import TeamCards from "./dashboard-components/TeamCards";
import TeamStatsModal from "./dashboard-components/TeamStatsModal";
import PredictionModal from "./dashboard-components/PredictionModal";
import AccountSettingsModal from "./dashboard-components/AccountSettingsModal";
import DashboardFooter from "./dashboard-components/DashboardFooter";
import AuthModal from "./dashboard-components/AuthModal";
import TermsModal from "./dashboard-components/TermsModal";
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
  const { user, getTeamPredictions, getUserPredictions } = useAuth();

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
      
      await Promise.all(nbaTeams.map(async (team) => {
        const { data } = await getTeamPredictions(team.name);
        const winsFor = data?.filter(p => p.outcome === true && p.bet_type === 'for').length || 0;
        const winsAgainst = data?.filter(p => p.outcome === true && p.bet_type === 'against').length || 0;
        const lossesFor = data?.filter(p => p.outcome === false && p.bet_type === 'for').length || 0;
        const lossesAgainst = data?.filter(p => p.outcome === false && p.bet_type === 'against').length || 0;
        
        stats[team.name] = {
          wins: winsFor + winsAgainst,
          losses: lossesFor + lossesAgainst,
          winsFor,
          winsAgainst,
          lossesFor,
          lossesAgainst,
          wr: (winsFor + winsAgainst) > 0 ? 
              `${Math.round(((winsFor + winsAgainst) / (winsFor + winsAgainst + lossesFor + lossesAgainst)) * 100)}%` : '0%'
        };
      }));

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
    }, [activeTab, user, showPredictionModal]);

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

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <DashboardHeader 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
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