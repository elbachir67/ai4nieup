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
  const filteredOtherGoals = filteredGoals.filter(goal => !goal.isRecommended);

  // ... (reste du code inchangé)
}
