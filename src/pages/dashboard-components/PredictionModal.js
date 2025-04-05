import { useState } from "react";
import { FiX, FiCheck, FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import Modal from "../../components/ui/modal";
import Button from "../../components/ui/button";
import { getLogoFilename } from "../Dashboard";

export default function PredictionModal({ isOpen, onClose, darkMode, selectedTeam, nbaTeams }) {
  const [predictionType, setPredictionType] = useState(null);
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [expandedPrediction, setExpandedPrediction] = useState(null);

  const handlePredictionSubmit = () => {
    // Here you would typically send the prediction to your backend
    console.log("Prediction recorded:", {
      team: selectedTeam.name,
      prediction: predictionType,
      opponent: selectedOpponent,
      betType: expandedPrediction
    });
    
    // Reset and close modal
    setPredictionType(null);
    setSelectedOpponent(null);
    setExpandedPrediction(null);
    onClose();
  };

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
              Record Your Prediction
            </h2>
          </div>
          <button 
            onClick={onClose}
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
            
            <h3 className="text-lg font-semibold">Prediction Type</h3>
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
                    <span>Predict FOR {selectedTeam.name.split(' ').pop()}</span>
                  </>
                ) : (
                  <>
                    <FiTrendingDown className="text-red-500 text-2xl" />
                    <span>Predict AGAINST {selectedTeam.name.split(' ').pop()}</span>
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
                    <span>Predict AGAINST {selectedOpponent.split(' ').pop()}</span>
                  </>
                ) : (
                  <>
                    <FiTrendingUp className="text-green-500 text-2xl" />
                    <span>Predict FOR {selectedOpponent.split(' ').pop()}</span>
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
            
            <Button
              onClick={handlePredictionSubmit}
              className="w-full mt-2"
              darkMode={darkMode}
            >
              Confirm Prediction
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}