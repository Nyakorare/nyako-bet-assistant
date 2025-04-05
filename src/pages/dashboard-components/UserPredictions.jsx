import React from 'react';

const UserPredictions = ({ userData, setUserData }) => {
  const updateStatus = (index, status) => {
    const updated = [...userData];
    updated[index].status = status;
    setUserData(updated);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {userData.map((team, index) => (
        <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded shadow">
          <div className="flex justify-between">
            <span>{team.name}</span>
            <div className="space-x-2">
              <button onClick={() => updateStatus(index, 'win')}>✅</button>
              <button onClick={() => updateStatus(index, 'lose')}>❌</button>
              <button onClick={() => updateStatus(index, null)}>🔄</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserPredictions;
