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
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, getUserPredictions, getTeamPredictions } = useAuth();

  useEffect(() => {
    const loadPredictions = async () => {
      if (!selectedTeam) return;
      
      setLoading(true);
      try {
        const { data } = activeTab === "user" 
          ? await getUserPredictions()
          : await getTeamPredictions(selectedTeam.name);
        
        const filtered = data?.filter(p => p.team_name === selectedTeam.name) || [];
        setPredictions(filtered);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      loadPredictions();
    }
  }, [isOpen, activeTab, selectedTeam]);

  const renderPredictionList = (items, isWin) => {
    if (!items || items.length === 0) {
      return (
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          No {isWin ? 'win' : 'loss'} predictions recorded
        </p>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-2">
        {items.map((item, index) => (
          <div 
            key={index} 
            className={`p-2 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-200'}`}
          >
            <p className="text-sm">vs {item.opponent}</p>
            {item.created_at && (
              <p className="text-xs mt-1">
                {new Date(item.created_at).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  };

  const stats = {
    wins: {
      for: predictions.filter(p => p.outcome === true && p.bet_type === 'for'),
      against: predictions.filter(p => p.outcome === true && p.bet_type === 'against')
    },
    losses: {
      for: predictions.filter(p => p.outcome === false && p.bet_type === 'for'),
      against: predictions.filter(p => p.outcome === false && p.bet_type === 'against')
    }
  };

  const resolvedPreds = predictions.filter(p => p.outcome !== null);
  const correctPreds = resolvedPreds.filter(p => p.outcome === true).length;
  const totalPreds = resolvedPreds.length;
  const winRate = totalPreds > 0 ? `${Math.round((correctPreds / totalPreds) * 100)}%` : 'N/A';

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
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/logos/default.png";
              }}
            />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              {selectedTeam.name} {activeTab === "user" ? "Your Stats" : "Statistics"}
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
              <FiTrendingUp /> Wins Analysis
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">
                  {activeTab === "user" ? "Your Correct Predictions" : "Team Wins"} - Betting FOR
                </h4>
                {renderPredictionList(stats.wins.for, true)}
              </div>
              <div>
                <h4 className="font-medium mb-2">
                  {activeTab === "user" ? "Your Correct Predictions" : "Team Wins"} - Betting AGAINST
                </h4>
                {renderPredictionList(stats.wins.against, true)}
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <h3 className={`flex items-center gap-2 text-lg font-semibold mb-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
              <FiTrendingDown /> Losses Analysis
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">
                  {activeTab === "user" ? "Your Incorrect Predictions" : "Team Losses"} - Betting FOR
                </h4>
                {renderPredictionList(stats.losses.for, false)}
              </div>
              <div>
                <h4 className="font-medium mb-2">
                  {activeTab === "user" ? "Your Incorrect Predictions" : "Team Losses"} - Betting AGAINST
                </h4>
                {renderPredictionList(stats.losses.against, false)}
              </div>
            </div>
          </div>
        </div>
        
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <h3 className="text-lg font-semibold mb-4">
            {activeTab === "user" ? "Your Prediction Statistics" : "Team Statistics"}
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                {activeTab === "user" ? "Prediction Accuracy" : "Win Rate"}
              </p>
              <p className={`text-xl font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                {winRate}
              </p>
            </div>
            <div className="text-center">
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                {activeTab === "user" ? "Correct Predictions" : "Wins"}
              </p>
              <p className="text-xl font-bold">
                {correctPreds}
              </p>
            </div>
            <div className="text-center">
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                {activeTab === "user" ? "Incorrect Predictions" : "Losses"}
              </p>
              <p className="text-xl font-bold">
                {totalPreds - correctPreds}
              </p>
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