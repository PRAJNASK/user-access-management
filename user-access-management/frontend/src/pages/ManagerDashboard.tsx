import React from 'react';
import PendingRequests from '../components/PendingRequests'; // Reverted to original import

const ManagerDashboard: React.FC = () => {
  return (
    <div>
      <h1>Manager Dashboard</h1>
      <PendingRequests />
    </div>
  );
};

export default ManagerDashboard;
