import React from 'react';

const GlobalPredictions = ({ globalData, setSelectedTeam, setShowModal }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {globalData.map((team, index) => (
      <div
        key={index}
        className="p-4 bg-white dark:bg-gray-800 rounded shadow cursor-pointer"
        onClick={() => {
          setSelectedTeam(team);
          setShowModal(true);
        }}
      >
        <div className="flex justify-between">
          <span>{team.name}</span>
        </div>
      </div>
    ))}
  </div>
);

export default GlobalPredictions;
