import React from 'react';

const PredictionsTabs = ({ activeTab, setActiveTab }) => (
  <div className="flex justify-center my-4 space-x-4">
    <button
      onClick={() => setActiveTab('your')}
      className={`px-4 py-2 rounded ${activeTab === 'your' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
    >
      Your Predictions
    </button>

    <button
      onClick={() => setActiveTab('global')}
      className={`px-4 py-2 rounded ${activeTab === 'global' ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-700'}`}
    >
      Global Predictions
    </button>
  </div>
);

export default PredictionsTabs;
