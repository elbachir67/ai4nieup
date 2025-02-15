import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import GoalsExplorerPage from './pages/GoalsExplorerPage';
import AssessmentPage from './pages/AssessmentPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/goals" element={<GoalsExplorerPage />} />
      <Route path="/assessment" element={<AssessmentPage />} />
    </Routes>
  );
}

export default App;