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
  { id: 'lowest-wr', label: 'Lowest Win Rate' },
  { id: 'user-highest-wins', label: 'Your Highest Wins' },
  { id: 'user-highest-losses', label: 'Your Highest Losses' },
  { id: 'user-highest-wr', label: 'Your Highest WR' },
  { id: 'user-lowest-wr', label: 'Your Lowest WR' }
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
  const [userPredictions, setUserPredictions] = useState([]);
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
    const fetchGlobalStats = async () => {
      const stats = {};
      
      await Promise.all(nbaTeams.map(async (team) => {
        const { data } = await getTeamPredictions(team.name);
        const resolved = data?.filter(p => p.outcome !== null) || [];
        const wins = resolved.filter(p => p.outcome === true).length;
        const losses = resolved.filter(p => p.outcome === false).length;
        const total = wins + losses;
        
        stats[team.name] = {
          wins,
          losses,
          wr: total > 0 ? `${Math.round((wins / total) * 100)}%` : '0%'
        };
      }));

      // Calculate ranks
      const rankedTeams = Object.entries(stats)
        .sort(([, a], [, b]) => {
          const aWr = parseFloat(a.wr);
          const bWr = parseFloat(b.wr);
          return bWr - aWr;
        });
      
      rankedTeams.forEach(([teamName], index) => {
        stats[teamName].rank = index + 1;
      });

      setGlobalStats(stats);
    };

    if (activeTab === 'global') {
      fetchGlobalStats();
    }
  }, [activeTab, showPredictionModal]);

  useEffect(() => {
    const fetchUserPredictions = async () => {
      if (user) {
        const { data } = await getUserPredictions();
        setUserPredictions(data || []);
      }
    };
    
    if (activeTab === 'user') {
      fetchUserPredictions();
    }
  }, [activeTab, user, showPredictionModal]);

  const calculateUserStats = (teamName) => {
    const teamPreds = userPredictions.filter(p => p.team_name === teamName);
    const resolved = teamPreds.filter(p => p.outcome !== null);
    const wins = resolved.filter(p => p.outcome === true).length;
    const losses = resolved.filter(p => p.outcome === false).length;
    const total = wins + losses;
    
    return {
      userWins: wins,
      userLosses: losses,
      userWr: total > 0 ? `${Math.round((wins / total) * 100)}%` : 'N/A'
    };
  };

  const filteredTeams = nbaTeams
    .map(team => ({
      ...team,
      ...(globalStats[team.name] || { wins: 0, losses: 0, wr: '0%', rank: 30 }),
      ...calculateUserStats(team.name)
    }))
    .filter(team => 
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.name.split(' ').pop().toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const useUserStats = selectedFilter.includes('user');
      const statA = useUserStats ? {
        wins: a.userWins,
        losses: a.userLosses,
        wr: parseFloat(a.userWr) || 0
      } : {
        wins: a.wins,
        losses: a.losses,
        wr: parseFloat(a.wr) || 0
      };

      const statB = useUserStats ? {
        wins: b.userWins,
        losses: b.userLosses,
        wr: parseFloat(b.userWr) || 0
      } : {
        wins: b.wins,
        losses: b.losses,
        wr: parseFloat(b.wr) || 0
      };

      switch (selectedFilter.replace('user-', '')) {
        case 'highest-wins': return statB.wins - statA.wins;
        case 'highest-losses': return statB.losses - statA.losses;
        case 'highest-wr': return statB.wr - statA.wr;
        case 'lowest-wr': return statA.wr - statB.wr;
        default: return statB.wr - statA.wr;
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