import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import GoalsExplorerPage from "./pages/GoalsExplorerPage";
import AssessmentPage from "./pages/AssessmentPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AddGoalPage from "./pages/AddGoalPage";
import EditGoalPage from "./pages/EditGoalPage";

function PrivateRoute({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route
          path="/goals"
          element={
            <PrivateRoute>
              <GoalsExplorerPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-goal"
          element={
            <PrivateRoute adminOnly>
              <AddGoalPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit-goal/:goalId"
          element={
            <PrivateRoute adminOnly>
              <EditGoalPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
