import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../config/api";
import {
  Clock,
  CheckCircle,
  Calendar,
  Award,
  Loader2,
  AlertCircle,
  BookOpen,
  Video,
  GraduationCap,
  Laptop,
  Bot,
  ChevronDown,
  Play,
  DivideIcon as LucideIcon,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Pathway, ResourceType, PathwayResource } from "../types";

interface ResourceTypeConfig {
  icon: typeof BookOpen;
  color: string;
  bg: string;
}

const resourceTypeConfig: Record<ResourceType, ResourceTypeConfig> = {
  article: { icon: BookOpen, color: "text-blue-400", bg: "bg-blue-400/20" },
  video: { icon: Video, color: "text-red-400", bg: "bg-red-400/20" },
  course: {
    icon: GraduationCap,
    color: "text-green-400",
    bg: "bg-green-400/20",
  },
  book: { icon: BookOpen, color: "text-purple-400", bg: "bg-purple-400/20" },
  use_case: { icon: Laptop, color: "text-orange-400", bg: "bg-orange-400/20" },
};

function PathwayPage() {
  const { pathwayId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pathway, setPathway] = useState<Pathway | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPathway = async () => {
      if (!pathwayId || !user) return;

      try {
        const response = await fetch(`${api.pathways}/${pathwayId}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement du parcours");
        }

        const data = await response.json();
        setPathway(data);
        setError(null);
      } catch (error) {
        console.error("Error:", error);
        setError(
          error instanceof Error ? error.message : "Erreur lors du chargement"
        );
        toast.error("Erreur lors du chargement du parcours");
      } finally {
        setLoading(false);
      }
    };

    fetchPathway();
  }, [pathwayId, user]);

  const handleResourceComplete = async (
    moduleIndex: number,
    resourceId: string
  ) => {
    if (!pathway || !user || !pathwayId) return;

    try {
      const response = await fetch(
        `${api.pathways}/${pathwayId}/modules/${moduleIndex}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resourceId,
            completed: true,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }

      const updatedPathway = await response.json();
      setPathway(updatedPathway);
      toast.success("Progression mise à jour");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur lors de la mise à jour de la progression");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Chargement du parcours...</span>
        </div>
      </div>
    );
  }

  if (error || !pathway) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-center text-gray-400">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p className="mb-4">{error || "Parcours non trouvé"}</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-100">
              {pathway.goalId.title}
            </h1>
            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  pathway.status === "active"
                    ? "bg-green-500/20 text-green-400"
                    : pathway.status === "completed"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }`}
              >
                {pathway.status === "active"
                  ? "En cours"
                  : pathway.status === "completed"
                  ? "Terminé"
                  : "En pause"}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progression globale</span>
              <span>{pathway.progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${pathway.progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <span>
                Début : {new Date(pathway.startedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              <span>
                Fin estimée :{" "}
                {new Date(pathway.estimatedCompletionDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-6">
          {pathway.moduleProgress.map((module, index) => (
            <div key={index} className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-200">
                  Module {index + 1}
                </h2>
                {module.completed ? (
                  <div className="flex items-center text-green-400">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span>Complété</span>
                  </div>
                ) : (
                  <div className="flex items-center text-gray-400">
                    <Clock className="w-5 h-5 mr-2" />
                    <span>En cours</span>
                  </div>
                )}
              </div>

              {/* Ressources */}
              <div className="space-y-4 mb-6">
                <h3 className="text-md font-medium text-gray-300">
                  Ressources
                </h3>
                {module.resources.map(
                  (resource: PathwayResource, resourceIndex: number) => {
                    const ResourceIcon =
                      (resource.type &&
                        resourceTypeConfig[resource.type]?.icon) ||
                      BookOpen;
                    return (
                      <div
                        key={resourceIndex}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50"
                      >
                        <div className="flex items-center">
                          <ResourceIcon className="w-5 h-5 text-gray-400 mr-3" />
                          <span className="text-gray-300">
                            Ressource {resourceIndex + 1}
                          </span>
                        </div>
                        {resource.completed ? (
                          <div className="flex items-center text-green-400">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            <span>Terminé</span>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              handleResourceComplete(index, resource.resourceId)
                            }
                            className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Marquer comme terminé
                          </button>
                        )}
                      </div>
                    );
                  }
                )}
              </div>

              {/* Quiz */}
              <div>
                <h3 className="text-md font-medium text-gray-300 mb-4">
                  Quiz de validation
                </h3>
                {module.quiz.completed ? (
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
                    <div className="flex items-center">
                      <Award className="w-5 h-5 text-yellow-400 mr-2" />
                      <span className="text-gray-300">
                        Score : {module.quiz.score}%
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      Complété le{" "}
                      {module.quiz.completedAt &&
                        new Date(module.quiz.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() =>
                      navigate(`/pathways/${pathwayId}/modules/${index}/quiz`)
                    }
                    className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Commencer le quiz
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Recommandations adaptatives */}
        {pathway.adaptiveRecommendations?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-100 mb-6">
              Recommandations personnalisées
            </h2>
            <div className="space-y-4">
              {pathway.adaptiveRecommendations.map((recommendation, index) => (
                <div
                  key={index}
                  className={`glass-card rounded-xl p-6 border-l-4 ${
                    recommendation.priority === "high"
                      ? "border-red-500"
                      : recommendation.priority === "medium"
                      ? "border-yellow-500"
                      : "border-blue-500"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-200 mb-2">
                        {recommendation.type === "resource"
                          ? "Ressource recommandée"
                          : recommendation.type === "practice"
                          ? "Exercice pratique"
                          : "Révision suggérée"}
                      </h3>
                      <p className="text-gray-400">
                        {recommendation.description}
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors">
                      Commencer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PathwayPage;
