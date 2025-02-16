import React, { useState, useEffect } from "react";
import { Search, Filter, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GoalCard from "../components/GoalCard";
import { Goal } from "../types";
import { api } from "../config/api";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

function GoalsExplorerPage() {
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (selectedCategory !== "all")
        queryParams.append("category", selectedCategory);
      if (selectedDifficulty !== "all")
        queryParams.append("difficulty", selectedDifficulty);

      const response = await fetch(`${api.goals}?${queryParams.toString()}`);
      if (!response.ok)
        throw new Error("Erreur lors du chargement des objectifs");

      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors du chargement des objectifs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [selectedCategory, selectedDifficulty]);

  const handleDelete = async (goalId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet objectif ?")) {
      return;
    }

    try {
      const response = await fetch(`${api.goals}/${goalId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      toast.success("Objectif supprimé avec succès");
      fetchGoals();
    } catch (error) {
      toast.error("Erreur lors de la suppression de l'objectif");
    }
  };

  const filteredGoals = goals.filter(goal => {
    const matchesSearch =
      goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

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
              Explorez nos parcours d'apprentissage et trouvez celui qui
              correspond à vos objectifs
            </p>
          </div>
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
              onChange={e => setSelectedCategory(e.target.value)}
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
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 border border-gray-700 rounded-lg bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="all">Tous les niveaux</option>
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
            </select>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map(goal => (
            <div key={goal.id} className="relative group">
              <GoalCard
                goal={goal}
                onClick={() => {
                  /* Navigation vers le détail de l'objectif */
                }}
                className="relative"
              />
              {isAdmin && (
                <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      navigate(`/edit-goal/${goal.id}`);
                    }}
                    className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      handleDelete(goal.id);
                    }}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

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
