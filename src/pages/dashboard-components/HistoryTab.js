// src/pages/dashboard-components/HistoryTab.js
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getLogoFilename } from "../Dashboard";

export default function HistoryTab({ darkMode }) {
  const { user, getUserPredictions } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      if (!user) return;
      setLoading(true);
      const { data } = await getUserPredictions();
      setPredictions(data || []);
      setLoading(false);
    };

    fetchPredictions();
  }, [user]);

  if (loading) {
    return (
      <div className={`flex-grow p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="text-center">Loading your prediction history...</div>
      </div>
    );
  }

  if (predictions.length === 0) {
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
            No Predictions Yet
          </h2>
          <p className={`mb-6 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            You haven't made any predictions yet. Start predicting to see your history here!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-grow p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        <h2 className={`text-2xl font-bold mb-6 ${
          darkMode ? 'text-emerald-400' : 'text-emerald-600'
        }`}>
          Your Prediction History
        </h2>
        
        <div className="space-y-4">
          {predictions.map((prediction) => (
            <div
              key={prediction.id}
              className={`p-4 rounded-lg border ${
                darkMode ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <img
                    src={`/logos/${getLogoFilename(prediction.team_name)}.png`}
                    alt={prediction.team_name}
                    className="h-10 w-10"
                  />
                  <div>
                    <h3 className="font-semibold">{prediction.team_name}</h3>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      vs {prediction.opponent}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    prediction.outcome
                      ? darkMode
                        ? 'bg-green-900/50 text-green-400'
                        : 'bg-green-100 text-green-800'
                      : darkMode
                        ? 'bg-red-900/50 text-red-400'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {prediction.outcome ? 'Correct' : 'Incorrect'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Bet Type
                  </p>
                  <p className="font-medium">
                    {prediction.bet_type === 'for' ? 'FOR' : 'AGAINST'}
                  </p>
                </div>
                <div>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Actual Outcome
                  </p>
                  <p className="font-medium">
                    {prediction.actual_outcome ? 'Win' : 'Loss'}
                  </p>
                </div>
              </div>
              
              <div className="mt-3">
                <p className={`text-xs ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {new Date(prediction.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}