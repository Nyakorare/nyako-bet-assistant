// src/pages/dashboard-components/PredictionModal.js
import { useState } from "react";
import { FiX, FiCheck, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import Modal from "../../components/ui/modal";
import Button from "../../components/ui/button";
import { getLogoFilename } from "../Dashboard";
import { useAuth } from "../../context/AuthContext";

export default function PredictionModal({ 
  isOpen, 
  onClose, 
  darkMode, 
  selectedTeam, 
  nbaTeams 
}) {
  const [step, setStep] = useState(1);
  const [actualOutcome, setActualOutcome] = useState(null);
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [betType, setBetType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { recordPrediction } = useAuth();

  const handlePredictionSubmit = async () => {
    if (!selectedTeam || !selectedOpponent || actualOutcome === null || !betType) {
      setError('Please complete all prediction steps');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const betCorrect = (actualOutcome && betType === 'for') || 
                        (!actualOutcome && betType === 'against');

      await recordPrediction({
        team_name: selectedTeam.name,
        opponent: selectedOpponent,
        bet_type: betType,
        outcome: betCorrect,
        actual_outcome: actualOutcome
      });

      resetForm();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to record prediction');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setActualOutcome(null);
    setSelectedOpponent(null);
    setBetType(null);
  };

  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Did {selectedTeam.name.split(' ').pop()} win this game?</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => {
                  setActualOutcome(true);
                  setStep(2);
                }}
                className="h-20 flex flex-col items-center justify-center gap-2"
                variant="outline"
                darkMode={darkMode}
              >
                <FiCheck className="text-green-500 text-2xl" />
                <span>Yes, they won</span>
              </Button>
              <Button
                onClick={() => {
                  setActualOutcome(false);
                  setStep(2);
                }}
                className="h-20 flex flex-col items-center justify-center gap-2"
                variant="outline"
                darkMode={darkMode}
              >
                <FiX className="text-red-500 text-2xl" />
                <span>No, they lost</span>
              </Button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Who were they playing against?</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {nbaTeams
                .filter(team => team.name !== selectedTeam.name)
                .map(team => (
                  <button
                    key={team.name}
                    onClick={() => {
                      setSelectedOpponent(team.name);
                      setStep(3);
                    }}
                    className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                      darkMode ? 'bg-gray-800 hover:bg-gray-700 border-gray-700' : 'bg-white hover:bg-gray-50 border-gray-200'
                    } border`}
                  >
                    <img 
                      src={`/logos/${getLogoFilename(team.name)}.png`}
                      alt={team.name}
                      className="h-8 w-8 mb-1"
                    />
                    <span className="text-xs text-center">{team.name.split(' ').pop()}</span>
                  </button>
                ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">What was your bet?</h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => setBetType('for')}
                className="h-20 flex flex-col items-center justify-center gap-2"
                variant={betType === 'for' ? 'default' : 'outline'}
                darkMode={darkMode}
              >
                <FiTrendingUp className="text-2xl" />
                <span>FOR {selectedTeam.name.split(' ').pop()}</span>
              </Button>
              <Button
                onClick={() => setBetType('against')}
                className="h-20 flex flex-col items-center justify-center gap-2"
                variant={betType === 'against' ? 'default' : 'outline'}
                darkMode={darkMode}
              >
                <FiTrendingDown className="text-2xl" />
                <span>AGAINST {selectedTeam.name.split(' ').pop()}</span>
              </Button>
            </div>
            <div className={`mt-4 p-3 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
              <p>Note: Your prediction will be collected as anonymous data in the global statistics to help improve our predictions.</p>
            </div>
            <Button
              onClick={handlePredictionSubmit}
              className="w-full mt-2"
              darkMode={darkMode}
              disabled={loading || !betType}
            >
              {loading ? "Saving..." : "Confirm Prediction"}
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  if (!selectedTeam) return null;

  return (
    <Modal isOpen={isOpen} onClose={() => { onClose(); resetForm(); }} darkMode={darkMode}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <img 
              src={`/logos/${getLogoFilename(selectedTeam.name)}.png`}
              alt={selectedTeam.name}
              className="h-16 w-16"
            />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              Record Prediction
            </h2>
          </div>
          <button 
            onClick={() => { onClose(); resetForm(); }}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
          >
            <FiX className={darkMode ? "text-gray-400" : "text-gray-600"} />
          </button>
        </div>
        
        {error && (
          <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-800'}`}>
            {error}
          </div>
        )}

        {renderStepContent()}
      </div>
    </Modal>
  );
}