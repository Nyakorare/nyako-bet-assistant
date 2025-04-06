// src/pages/dashboard-components/TeamStatsModal.js
import { useState, useEffect } from "react";
import { FiX, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import Modal from "../../components/ui/modal";
import { getLogoFilename } from "../Dashboard";
import Button from "../../components/ui/button";
import { useAuth } from "../../context/AuthContext";

export default function TeamStatsModal({ 
  isOpen, 
  onClose, 
  darkMode, 
  selectedTeam,
  activeTab,
  onRecordPrediction
}) {
  const [stats, setStats] = useState({
    winsFor: 0,
    winsAgainst: 0,
    lossesFor: 0,
    lossesAgainst: 0
  });
  const { getUserPredictions, getTeamPredictions } = useAuth();

  useEffect(() => {
    const loadStats = async () => {
      const { data } = activeTab === 'user' 
        ? await getUserPredictions()
        : await getTeamPredictions(selectedTeam.name);
      
      const teamPreds = data?.filter(p => p.team_name === selectedTeam.name) || [];
      
      setStats({
        winsFor: teamPreds.filter(p => p.outcome && p.bet_type === 'for').length,
        winsAgainst: teamPreds.filter(p => p.outcome && p.bet_type === 'against').length,
        lossesFor: teamPreds.filter(p => !p.outcome && p.bet_type === 'for').length,
        lossesAgainst: teamPreds.filter(p => !p.outcome && p.bet_type === 'against').length
      });
    };

    if (isOpen) loadStats();
  }, [isOpen, activeTab, selectedTeam]);

  const totalWins = stats.winsFor + stats.winsAgainst;
  const totalLosses = stats.lossesFor + stats.lossesAgainst;
  const winRate = totalWins + totalLosses > 0 
    ? `${Math.round((totalWins / (totalWins + totalLosses)) * 100)}%` 
    : 'N/A';

  if (!selectedTeam) return null;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} darkMode={darkMode}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img 
              src={`/logos/${getLogoFilename(selectedTeam.name)}.png`}
              alt={selectedTeam.name}
              className="h-16 w-16"
            />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {selectedTeam.name} {activeTab === "user" ? "Your Stats" : "Stats"}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <FiX className={darkMode ? "text-gray-400" : "text-gray-600"} />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <h3 className={`flex items-center gap-2 text-lg font-semibold mb-4 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              <FiTrendingUp /> Correct Predictions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Betting FOR</h4>
                <p className="text-2xl font-bold">{stats.winsFor}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Betting AGAINST</h4>
                <p className="text-2xl font-bold">{stats.winsAgainst}</p>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <h3 className={`flex items-center gap-2 text-lg font-semibold mb-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
              <FiTrendingDown /> Incorrect Predictions
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Betting FOR</h4>
                <p className="text-2xl font-bold">{stats.lossesFor}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Betting AGAINST</h4>
                <p className="text-2xl font-bold">{stats.lossesAgainst}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <h3 className="text-lg font-semibold mb-4">Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Win Rate</p>
              <p className={`text-xl font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                {winRate}
              </p>
            </div>
            <div className="text-center">
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Correct</p>
              <p className="text-xl font-bold">{totalWins}</p>
            </div>
            <div className="text-center">
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Incorrect</p>
              <p className="text-xl font-bold">{totalLosses}</p>
            </div>
          </div>
        </div>

        {activeTab === "user" && (
          <Button
            onClick={() => {
              onClose();
              onRecordPrediction(selectedTeam);
            }}
            className="w-full mt-4"
            darkMode={darkMode}
          >
            Make New Prediction
          </Button>
        )}
      </div>
    </Modal>
  );
}