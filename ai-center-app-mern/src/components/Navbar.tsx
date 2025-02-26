import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, LogOut, User, Plus, LayoutDashboard } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, signOut, user, isAuthenticated } = useAuth();

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <nav className="glass sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="w-8 h-8 text-purple-500 animate-float" />
              <span className="ml-2 text-xl font-bold gradient-text">
                IA4Nieup
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <Link to="/" className={`nav-link ${isActive("/")}`}>
              Accueil
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`nav-link ${isActive("/dashboard")}`}
                >
                  <div className="flex items-center space-x-1">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Tableau de bord</span>
                  </div>
                </Link>
                <Link to="/goals" className={`nav-link ${isActive("/goals")}`}>
                  Objectifs
                </Link>
              </>
            ) : (
              <Link
                to="/assessment"
                className={`nav-link ${isActive("/assessment")}`}
              >
                Évaluation
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/add-goal"
                className="flex items-center px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvel Objectif
              </Link>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-300">
                  <User className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Déconnexion
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
