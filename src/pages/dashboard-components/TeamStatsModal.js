import { useState, useEffect } from "react";
import { FiX, FiTrendingUp, FiTrendingDown, FiClock } from "react-icons/fi";
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
    lossesAgainst: 0,
    totalPredictions: 0
  });
  const [userPredictions, setUserPredictions] = useState([]);
  const { user, getUserPredictions, getGlobalStats } = useAuth();

  useEffect(() => {
    const loadStats = async () => {
      if (activeTab === 'user' && user) {
        const { data } = await getUserPredictions();
        const teamPreds = data?.filter(p => p.team_name === selectedTeam.name) || [];
        
        setStats({
          winsFor: teamPreds.filter(p => p.outcome && p.bet_type === 'for').length,
          winsAgainst: teamPreds.filter(p => p.outcome && p.bet_type === 'against').length,
          lossesFor: teamPreds.filter(p => !p.outcome && p.bet_type === 'for').length,
          lossesAgainst: teamPreds.filter(p => !p.outcome && p.bet_type === 'against').length,
          totalPredictions: teamPreds.length
        });
        setUserPredictions(teamPreds);
      } else {
        const { data } = await getGlobalStats();
        const teamPreds = data?.filter(p => p.team_name === selectedTeam.name) || [];
        
        setStats({
          winsFor: teamPreds.filter(p => p.outcome && p.bet_type === 'for').length,
          winsAgainst: teamPreds.filter(p => p.outcome && p.bet_type === 'against').length,
          lossesFor: teamPreds.filter(p => !p.outcome && p.bet_type === 'for').length,
          lossesAgainst: teamPreds.filter(p => !p.outcome && p.bet_type === 'against').length,
          totalPredictions: teamPreds.length
        });
      }
    };

    if (isOpen && selectedTeam) loadStats();
  }, [isOpen, activeTab, selectedTeam, user]);

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
              {selectedTeam.name} {activeTab === "user" ? "Your Stats" : "Global Stats"}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <FiX className={darkMode ? "text-gray-400" : "text-gray-600"} />
          </button>
        </div>

        {/* Stats Grid - Reorganized Layout */}
        <div className="grid grid-cols-1 gap-6 mb-6">
          {/* Summary Section at the Top */}
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Win Rate</p>
                <p className={`text-2xl font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  {winRate}
                </p>
              </div>
              <div className="text-center">
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Total Predictions</p>
                <p className="text-2xl font-bold">{stats.totalPredictions}</p>
              </div>
              <div className="text-center">
                <p className={darkMode ? "text-gray-400" : "text-gray-600"}>Record</p>
                <p className="text-2xl font-bold">{totalWins}-{totalLosses}</p>
              </div>
            </div>
          </div>

          {/* Correct/Incorrect Predictions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>

        {/* User Predictions Table (only in user tab) */}
        {activeTab === "user" && userPredictions.length > 0 && (
          <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <h3 className={`flex items-center gap-2 text-lg font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <FiClock /> Your Prediction History
            </h3>
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className={`text-left ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <th className="p-2">Date</th>
                    <th className="p-2">Bet</th>
                    <th className="p-2">Outcome</th>
                    <th className="p-2">Opponent</th>
                  </tr>
                </thead>
                <tbody>
                  {userPredictions.map((prediction, index) => (
                    <tr 
                      key={index} 
                      className={`${index % 2 === 0 ? (darkMode ? 'bg-gray-700/50' : 'bg-gray-200/50') : ''}`}
                    >
                      <td className="p-2">
                        {new Date(prediction.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          prediction.bet_type === 'for' 
                            ? (darkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-800')
                            : (darkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-800')
                        }`}>
                          {prediction.bet_type.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          prediction.outcome 
                            ? (darkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800')
                            : (darkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-800')
                        }`}>
                          {prediction.outcome ? 'Correct' : 'Incorrect'}
                        </span>
                      </td>
                      <td className="p-2">{prediction.opponent.split(' ').pop()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "user" && user && (
          <Button
            onClick={() => {
              onClose();
              onRecordPrediction(selectedTeam);
            }}
            className="w-full"
            darkMode={darkMode}
          >
            Make New Prediction
          </Button>
        )}
      </div>
    </Modal>
  );
}