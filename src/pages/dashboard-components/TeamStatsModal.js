import { FiX, FiTrendingUp, FiTrendingDown, FiUser } from "react-icons/fi";
import Modal from "../../components/ui/modal";
import { getLogoFilename } from "../Dashboard";
import Button from "../../components/ui/button";

export default function TeamStatsModal({ 
  isOpen, 
  onClose, 
  darkMode, 
  selectedTeam,
  activeTab,
  onRecordPrediction
}) {
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
            {activeTab === "user" && (
            <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                <FiUser /> Your Correct Win Predictions
                </h4>
                <div className="grid grid-cols-2 gap-2">
                {selectedTeam.userWinsFor?.length > 0 ? (
                    selectedTeam.userWinsFor.map((win, index) => (
                    <div key={index} className={`p-2 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-200'}`}>
                        <p className="text-sm">vs {win.opponent}</p>
                        <p className="text-xs mt-1">{win.date}</p>
                    </div>
                    ))
                ) : (
                    <p className={`col-span-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No correct win predictions
                    </p>
                )}
                </div>
            </div>
            )}
              
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <FiUser /> {activeTab === "user" ? "Your Win Predictions" : "Team Wins Against"}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedTeam.winsAgainst?.length > 0 ? (
                    selectedTeam.winsAgainst.map((team, index) => (
                      <div key={index} className={`p-2 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-200'}`}>
                        <p className="text-sm">vs {team}</p>
                      </div>
                    ))
                  ) : (
                    <p className={`col-span-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {activeTab === "user" ? "No win predictions" : "No wins recorded"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <h3 className={`flex items-center gap-2 text-lg font-semibold mb-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
              <FiTrendingDown /> Losses Analysis
            </h3>
            <div className="space-y-4">
            {activeTab === "user" && (
            <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                <FiUser /> Your Incorrect Loss Predictions
                </h4>
                <div className="grid grid-cols-2 gap-2">
                {selectedTeam.userLossesAgainst?.length > 0 ? (
                    selectedTeam.userLossesAgainst.map((loss, index) => (
                    <div key={index} className={`p-2 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-200'}`}>
                        <p className="text-sm">vs {loss.opponent}</p>
                        <p className="text-xs mt-1">{loss.date}</p>
                    </div>
                    ))
                ) : (
                    <p className={`col-span-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No incorrect loss predictions
                    </p>
                )}
                </div>
            </div>
            )}
              
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <FiUser /> {activeTab === "user" ? "Your Loss Predictions" : "Team Losses Against"}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedTeam.lossesAgainst?.length > 0 ? (
                    selectedTeam.lossesAgainst.map((team, index) => (
                      <div key={index} className={`p-2 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-200'}`}>
                        <p className="text-sm">vs {team}</p>
                      </div>
                    ))
                  ) : (
                    <p className={`col-span-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {activeTab === "user" ? "No loss predictions" : "No losses recorded"}
                    </p>
                  )}
                </div>
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
                {activeTab === "user" ? selectedTeam.userWr || 'N/A' : selectedTeam.wr || 'N/A'}
              </p>
            </div>
            <div className="text-center">
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                {activeTab === "user" ? "Correct Predictions" : "Wins"}
              </p>
              <p className="text-xl font-bold">
                {activeTab === "user" ? selectedTeam.userWins || '0' : selectedTeam.wins || '0'}
              </p>
            </div>
            <div className="text-center">
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                {activeTab === "user" ? "Incorrect Predictions" : "Losses"}
              </p>
              <p className="text-xl font-bold">
                {activeTab === "user" ? selectedTeam.userLosses || '0' : selectedTeam.losses || '0'}
              </p>
            </div>
          </div>
        </div>

        {activeTab === "user" && (
            <Button
                onClick={() => {
                onClose(); // Close the stats modal
                // You'll need to pass down the handleRecordPrediction function from Dashboard
                // and call it here with selectedTeam
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