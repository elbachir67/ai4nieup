import React, { useState, useEffect } from "react";
import { Search, Filter, Lock, AlertCircle, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GoalCard from "../components/GoalCard";
import { Goal, GoalCategory, GoalDifficulty } from "../types";
import { api } from "../config/api";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import {
  filterGoalsByUserProfile,
  filterGoalsBySearch,
} from "../utils/goalFilters";

function GoalsExplorerPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, hasCompletedAssessment } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    GoalCategory | "all"
  >("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    GoalDifficulty | "all"
  >("all");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [recommendedGoals, setRecommendedGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", "/goals");
      navigate("/login");
      return;
    }

    if (!hasCompletedAssessment) {
      toast.error(
        "Veuillez compléter l'évaluation avant d'accéder aux objectifs"
      );
      navigate("/assessment");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer le profil utilisateur
        const profileResponse = await fetch(api.profiles, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        });

        if (!profileResponse.ok) {
          throw new Error("Erreur lors du chargement du profil");
        }

        const profileData = await profileResponse.json();
        setUserProfile(profileData);

        // Récupérer les objectifs
        const goalsResponse = await fetch(api.goals, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        });

        if (!goalsResponse.ok) {
          throw new Error("Erreur lors du chargement des objectifs");
        }

        const goalsData = await goalsResponse.json();

        // Filtrer et trier les objectifs
        const { recommended, others } = filterGoalsByUserProfile(
          goalsData,
          profileData
        );
        setRecommendedGoals(recommended);
        setGoals([...recommended, ...others]);
      } catch (error) {
        console.error("Erreur:", error);
        setError(
          error instanceof Error ? error.message : "Erreur lors du chargement"
        );
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, hasCompletedAssessment, navigate]);

  // Filtrer les objectifs
  const filteredGoals = filterGoalsBySearch(
    goals,
    searchQuery,
    selectedCategory === "all" ? undefined : selectedCategory,
    selectedDifficulty === "all" ? undefined : selectedDifficulty
  );

  // Séparer les objectifs filtrés
  const filteredRecommendedGoals = filteredGoals.filter(
    goal => goal.isRecommended
  );
  const filteredNonRecommendedGoals = filteredGoals.filter(
    goal => !goal.isRecommended
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="mb-6 p-4 rounded-full bg-gray-800/50 w-16 h-16 mx-auto flex items-center justify-center">
            <Lock className="w-8 h-8 text-purple-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-4">
            Connexion Requise
          </h2>
          <p className="text-gray-400 mb-6">
            Connectez-vous pour accéder aux objectifs d'apprentissage.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Se Connecter
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-gray-400">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-100 mb-4">
              Objectifs d'Apprentissage
            </h1>
            <p className="text-gray-400">
              Parcours personnalisés basés sur votre profil et vos compétences
            </p>
          </div>
          <button
            onClick={() => navigate("/assessment")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Refaire l'évaluation
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un objectif..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex space-x-4">
            <select
              value={selectedCategory}
              onChange={e =>
                setSelectedCategory(e.target.value as "all" | GoalCategory)
              }
              className="block w-full pl-3 pr-10 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Toutes les catégories</option>
              <option value="ml">Machine Learning</option>
              <option value="dl">Deep Learning</option>
              <option value="data_science">Data Science</option>
              <option value="mlops">MLOps</option>
              <option value="computer_vision">Computer Vision</option>
              <option value="nlp">NLP</option>
            </select>

            <select
              value={selectedDifficulty}
              onChange={e =>
                setSelectedDifficulty(e.target.value as "all" | GoalDifficulty)
              }
              className="block w-full pl-3 pr-10 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Tous les niveaux</option>
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
            </select>
          </div>
        </div>

        {/* Recommended Goals Section */}
        {filteredRecommendedGoals.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center mb-6">
              <Sparkles className="w-6 h-6 text-yellow-500 mr-2" />
              <h2 className="text-2xl font-bold text-gray-100">
                Recommandés pour vous
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecommendedGoals.map(goal => (
                <GoalCard key={goal.id} goal={goal} isRecommended />
              ))}
            </div>
          </div>
        )}

        {/* Other Goals Grid */}
        {filteredNonRecommendedGoals.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-100 mb-6">
              Autres Objectifs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNonRecommendedGoals.map(goal => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredGoals.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
              <Filter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-100 mb-2">
              Aucun objectif trouvé
            </h3>
            <p className="text-gray-400">
              Essayez de modifier vos filtres ou votre recherche
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GoalsExplorerPage;
