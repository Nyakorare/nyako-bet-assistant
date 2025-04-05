import React, { useState, useEffect } from 'react';
import Navbar from './dashboard-components/Navbar';
import StatsSection from './dashboard-components/StatsSection';
import PredictionsTabs from './dashboard-components/PredictionsTabs';
import UserPredictions from './dashboard-components/UserPredictions';
import GlobalPredictions from './dashboard-components/GlobalPredictions';
import GlobalTeamModal from './dashboard-components/GlobalTeamModal';
import SignInRegisterModal from './dashboard-components/SignInRegisterModal';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('your');
  const [user, setUser] = useState(null);
  const [globalData, setGlobalData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    // Simulated fetch (replace with actual Supabase calls)
    setUser({ name: 'User1' });
    setGlobalData([]);
    setUserData([]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navbar user={user} />
      <div className="p-4">
        <StatsSection userData={userData} />
        <PredictionsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'your' ? (
          <UserPredictions userData={userData} setUserData={setUserData} />
        ) : (
          <GlobalPredictions globalData={globalData} setSelectedTeam={setSelectedTeam} setShowModal={setShowModal} />
        )}
      </div>
      <GlobalTeamModal showModal={showModal} setShowModal={setShowModal} team={selectedTeam} globalData={globalData} />
      {!user && <SignInRegisterModal setUser={setUser} />}
    </div>
  );
};

export default Dashboard;