/**
 * src/pages/protected/Dashboard.jsx
 * Main landing page for authenticated users, featuring AI-driven test generation stubs.
 */

import React from 'react';

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p>Welcome to your Apiverge dashboard. Use AI tools to automate your API testing workflows.</p>
      {/* Placeholder for AI-driven test generation. Replace with real integrations. */}
      <div className="mt-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Generate Tests with AI
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
