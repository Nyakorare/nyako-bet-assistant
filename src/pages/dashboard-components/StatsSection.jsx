import React from 'react';

const StatsSection = ({ userData }) => {
  const correctBets = userData.filter(u => u.status === 'win').length;
  const totalBets = userData.length;
  const winRate = totalBets ? ((correctBets / totalBets) * 100).toFixed(2) : 0;

  return (
    <div className="my-4 text-center">
      <p>Correct Bets: {correctBets} / {totalBets}</p>
      <p>Win Rate: {winRate}%</p>
    </div>
  );
};

export default StatsSection;
