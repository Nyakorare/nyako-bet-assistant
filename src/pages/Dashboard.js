import { useState } from "react";
import { nbaTeams } from "../components/data/nbaTeams";
import DashboardHeader from "./dashboard-components/DashboardHeader";
import TeamCards from "./dashboard-components/TeamCards";
import TeamStatsModal from "./dashboard-components/TeamStatsModal";
import PredictionModal from "./dashboard-components/PredictionModal";
import AccountSettingsModal from "./dashboard-components/AccountSettingsModal";
import DashboardFooter from "./dashboard-components/DashboardFooter";

// Helper function to get logo filename
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

// Filter options
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    // Only show team stats modal when clicking a team
    setShowTeamStatsModal(true);
  };
  
  // Add a new function for handling prediction recording
  const handleRecordPrediction = (team) => {
    setSelectedTeam(team);
    setShowPredictionModal(true);
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
        default:
          return (b.userWr || b.wr || 0) - (a.userWr || a.wr || 0);
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
        setShowAccountSettings={setShowAccountSettings}
        handleTeamClick={handleTeamClick}
        onRecordPrediction={handleRecordPrediction} // Pass the new handler
      />

      <DashboardFooter darkMode={darkMode} />

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
      onRecordPrediction={handleRecordPrediction} // Pass the new handler
    />
    )}
      
      {showAccountSettings && (
        <AccountSettingsModal 
          isOpen={showAccountSettings}
          onClose={() => setShowAccountSettings(false)}
          darkMode={darkMode}
        />
      )}

      {/* Add custom animation styles */}
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