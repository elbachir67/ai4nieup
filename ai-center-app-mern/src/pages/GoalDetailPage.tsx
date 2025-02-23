import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../config/api";
import { Goal } from "../types";
import { useAuth } from "../contexts/AuthContext";
import {
  Clock,
  GraduationCap,
  Target,
  BookOpen,
  Video,
  Code,
  Laptop,
  ChevronDown,
  BrainCircuit,
  Trophy,
  Building,
  DollarSign,
  Loader2,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  Calendar,
  Award,
} from "lucide-react";

const resourceTypeConfig = {
  article: { icon: BookOpen, color: "text-blue-500", bg: "bg-blue-100" },
  video: { icon: Video, color: "text-red-500", bg: "bg-red-100" },
  course: { icon: GraduationCap, color: "text-green-500", bg: "bg-green-100" },
  book: { icon: BookOpen, color: "text-purple-500", bg: "bg-purple-100" },
  use_case: { icon: Laptop, color: "text-orange-500", bg: "bg-orange-100" },
};

const levelConfig = {
  basic: {
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    label: "Débutant",
  },
  beginner: {
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
    label: "Débutant",
  },
  intermediate: {
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    label: "Intermédiaire",
  },
  advanced: {
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    label: "Avancé",
  },
};

function GoalDetailPage() {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingPathway, setGeneratingPathway] = useState(false);
  const [expandedModules, setExpandedModules] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const fetchGoal = async () => {
      if (!goalId) {
        setError("ID de l'objectif manquant");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${api.goals}/${goalId}`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement de l'objectif");
        }

        const data = await response.json();
        setGoal(data);

        // Initialiser l'état d'expansion des modules
        const initialExpandedState =
          data.modules?.reduce((acc: any, _: any, index: number) => {
            acc[index] = index === 0; // Premier module développé par défaut
            return acc;
          }, {}) || {};

        setExpandedModules(initialExpandedState);
        setError(null);
      } catch (error) {
        console.error("Error:", error);
        setError(
          error instanceof Error ? error.message : "Erreur lors du chargement"
        );
        toast.error("Erreur lors du chargement de l'objectif");
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [goalId, user]);

  const generatePathway = async () => {
    if (!goal || !user) return;

    setGeneratingPathway(true);
    try {
      const response = await fetch(`${api.pathways}/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ goalId: goal._id }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la génération du parcours");
      }

      const pathway = await response.json();
      toast.success("Parcours personnalisé généré avec succès !");
      navigate(`/pathways/${pathway._id}`);
    } catch (error) {
      toast.error("Erreur lors de la génération du parcours");
    } finally {
      setGeneratingPathway(false);
    }
  };

  const toggleModule = (index: number) => {
    setExpandedModules(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="flex items-center space-x-2 text-gray-400">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Chargement...</span>
        </div>
      </div>
    );
  }

  if (error || !goal) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            {error || "Objectif non trouvé"}
          </div>
          <button
            onClick={() => navigate("/goals")}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retour aux objectifs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header avec gradient et effet glassmorphism */}
        <div className="glass-card rounded-xl p-8 mb-8 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-purple-500/10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-100 mb-4">
                {goal.title}
              </h1>
              <p className="text-xl text-gray-400 mb-6">{goal.description}</p>
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center text-gray-300 bg-gray-800/50 px-4 py-2 rounded-lg">
                  <Clock className="w-5 h-5 mr-2" />
                  <span>{goal.estimatedDuration} semaines</span>
                </div>
                <div className="flex items-center">
                  <span
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      levelConfig[goal.level].bg
                    } ${levelConfig[goal.level].color} border ${
                      levelConfig[goal.level].border
                    }`}
                  >
                    {levelConfig[goal.level].label}
                  </span>
                </div>
                <button
                  onClick={generatePathway}
                  disabled={generatingPathway}
                  className="ml-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generatingPathway ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <BrainCircuit className="w-5 h-5 mr-2" />
                      Générer mon parcours personnalisé
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center space-x-2 text-gray-400">
                <Users className="w-5 h-5" />
                <span>150+ apprenants</span>
              </div>
              <div className="flex items-center space-x-2 text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <span>4.8/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Prérequis */}
        {goal.prerequisites && goal.prerequisites.length > 0 && (
          <div className="glass-card rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
              <Target className="w-6 h-6 mr-3 text-blue-400" />
              Prérequis
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {goal.prerequisites.map((prereq, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50"
                >
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">
                    {prereq.category}
                  </h3>
                  <div className="space-y-2">
                    {prereq.skills.map((skill, skillIndex) => {
                      const levelStyle = levelConfig[skill.level];
                      return (
                        <div
                          key={skillIndex}
                          className="flex items-center justify-between p-2 rounded-lg bg-gray-700/30"
                        >
                          <span className="text-gray-300">{skill.name}</span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${levelStyle.bg} ${levelStyle.color}`}
                          >
                            {levelStyle.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modules */}
        {goal.modules && goal.modules.length > 0 && (
          <div className="glass-card rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-purple-400" />
              Programme
            </h2>
            <div className="space-y-4">
              {goal.modules.map((module, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden"
                >
                  <button
                    onClick={() => toggleModule(index)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 mr-4">
                        {index + 1}
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-semibold text-gray-200">
                          {module.title}
                        </h3>
                        <p className="text-gray-400">{module.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-gray-400">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{module.duration}h</span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transform transition-transform ${
                          expandedModules[index] ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {expandedModules[index] && (
                    <div className="px-6 pb-6 animate-fadeIn">
                      {/* Compétences */}
                      {module.skills && module.skills.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-md font-semibold text-gray-300 mb-3 flex items-center">
                            <Award className="w-4 h-4 mr-2" />
                            Compétences acquises
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {module.skills.map((skill, skillIndex) => {
                              const levelStyle = levelConfig[skill.level];
                              return (
                                <span
                                  key={skillIndex}
                                  className={`px-3 py-1 rounded-full text-sm ${levelStyle.bg} ${levelStyle.color} border ${levelStyle.border}`}
                                >
                                  {skill.name}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Ressources */}
                      {module.resources && module.resources.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold text-gray-300 mb-3 flex items-center">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Ressources
                          </h4>
                          {module.resources.map((resource, resourceIndex) => {
                            const typeConfig =
                              resourceTypeConfig[
                                resource.type as keyof typeof resourceTypeConfig
                              ];
                            const Icon = typeConfig?.icon || BookOpen;
                            return (
                              <a
                                key={resourceIndex}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors group"
                              >
                                <span
                                  className={`p-2 rounded-md ${
                                    typeConfig?.bg || "bg-gray-100"
                                  } mr-3 group-hover:scale-110 transition-transform`}
                                >
                                  <Icon
                                    className={`w-4 h-4 ${
                                      typeConfig?.color || "text-gray-600"
                                    }`}
                                  />
                                </span>
                                <div className="flex-1">
                                  <span className="text-gray-200 group-hover:text-gray-100 transition-colors">
                                    {resource.title}
                                  </span>
                                  <div className="flex items-center space-x-3 mt-1">
                                    <span className="text-sm text-gray-400">
                                      {resource.duration} min
                                    </span>
                                  </div>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                              </a>
                            );
                          })}
                        </div>
                      )}

                      {/* Critères de validation */}
                      {module.validationCriteria &&
                        module.validationCriteria.length > 0 && (
                          <div className="mt-6">
                            <h4 className="text-md font-semibold text-gray-300 mb-3 flex items-center">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Critères de validation
                            </h4>
                            <ul className="space-y-2">
                              {module.validationCriteria.map(
                                (criteria, criteriaIndex) => (
                                  <li
                                    key={criteriaIndex}
                                    className="flex items-start space-x-2 text-gray-400"
                                  >
                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2" />
                                    <span>{criteria}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Débouchés */}
        {goal.careerOpportunities && goal.careerOpportunities.length > 0 && (
          <div className="glass-card rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
              <Building className="w-6 h-6 mr-3 text-green-400" />
              Débouchés
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {goal.careerOpportunities.map((opportunity, index) => (
                <div
                  key={index}
                  className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50"
                >
                  <h3 className="text-lg font-semibold text-gray-200 mb-3 flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
                    {opportunity.title}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    {opportunity.description}
                  </p>
                  <div className="flex items-center text-gray-300 mb-3">
                    <DollarSign className="w-4 h-4 mr-1 text-green-400" />
                    <span>{opportunity.averageSalary}</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-300">
                      Entreprises qui recrutent :
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {opportunity.companies.map((company, companyIndex) => (
                        <span
                          key={companyIndex}
                          className="px-3 py-1 rounded-full text-sm bg-gray-700/50 text-gray-300"
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certification */}
        {goal.certification?.available && (
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center">
              <Award className="w-6 h-6 mr-3 text-yellow-400" />
              Certification
            </h2>
            <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">
                    {goal.certification.name}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Proposée par {goal.certification.provider}
                  </p>
                  <a
                    href={goal.certification.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors"
                  >
                    <GraduationCap className="w-5 h-5 mr-2" />
                    En savoir plus
                  </a>
                </div>
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/20">
                  <Trophy className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GoalDetailPage;
