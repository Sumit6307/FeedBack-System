import React from 'react';

const Dashboard = ({ user }) => {
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}</h2>
      <p className="text-lg">Role: {user.role}</p>
    </div>
  );
};

export default Dashboard;