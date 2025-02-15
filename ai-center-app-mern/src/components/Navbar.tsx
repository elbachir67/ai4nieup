import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const location = useLocation();
  const { isAdmin, signOut } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'text-blue-600 after:w-full' : '';
  };

  return (
    <nav className="glass sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <BookOpen className="w-8 h-8 text-blue-600 animate-float" />
            <span className="ml-2 text-xl font-bold gradient-text">Parcours IA UCAD</span>
          </div>
          <div className="flex items-center space-x-8">
            <Link to="/" className={`nav-link ${isActive('/')}`}>
              Accueil
            </Link>
            <Link to="/roadmap" className={`nav-link ${isActive('/roadmap')}`}>
              Parcours
            </Link>
            {isAdmin && (
              <>
                <Link to="/add-step" className={`nav-link ${isActive('/add-step')}`}>
                  Ajouter une Étape
                </Link>
                <Link to="/manage-resources" className={`nav-link ${isActive('/manage-resources')}`}>
                  Gérer les Ressources
                </Link>
                <button
                  onClick={signOut}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                >
                  Déconnexion
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;