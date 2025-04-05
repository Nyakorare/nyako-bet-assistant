import React from 'react';

const GlobalTeamModal = ({ showModal, setShowModal, team, globalData }) => {
  if (!showModal || !team) return null;

  const usersWin = team.usersWin || [];
  const usersLose = team.usersLose || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow w-80">
        <h2 className="text-lg font-bold mb-4">{team.name}</h2>
        <p>Users who picked Win: {usersWin.length}</p>
        <p>Users who picked Lose: {usersLose.length}</p>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setShowModal(false)}>
          Close
        </button>
      </div>
    </div>
  );
};

export default GlobalTeamModal;
