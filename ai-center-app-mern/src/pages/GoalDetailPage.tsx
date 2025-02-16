import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../config/api";
import { Goal } from "../types";
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
} from "lucide-react";

const resourceTypeConfig = {
  video: { icon: Video, color: "text-red-500", bg: "bg-red-100" },
  article: { icon: BookOpen, color: "text-blue-500", bg: "bg-blue-100" },
  book: { icon: BookOpen, color: "text-purple-500", bg: "bg-purple-100" },
  tutorial: { icon: Code, color: "text-green-500", bg: "bg-green-100" },
  project: { icon: Laptop, color: "text-orange-500", bg: "bg-orange-100" },
};

const levelConfig = {
  basic: { color: "text-green-500", bg: "bg-green-100", label: "Débutant" },
  beginner: { color: "text-green-500", bg: "bg-green-100", label: "Débutant" },
  intermediate: {
    color: "text-blue-500",
    bg: "bg-blue-100",
    label: "Intermédiaire",
  },
  advanced: { color: "text-purple-500", bg: "bg-purple-100", label: "Avancé" },
};

const getLevelStyle = (level: string) => {
  const normalizedLevel = level.toLowerCase();
  if (normalizedLevel === "basic" || normalizedLevel === "beginner") {
    return levelConfig.basic;
  }
  return levelConfig[normalizedLevel] || levelConfig.intermediate;
};

function GoalDetailPage() {
  const { goalId } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const response = await fetch(`${api.goals}/${goalId}`);
        if (!response.ok)
          throw new Error("Erreur lors du chargement de l'objectif");
        const data = await response.json();
        setGoal(data);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Erreur lors du chargement de l'objectif");
        navigate("/goals");
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [goalId, navigate]);

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

  if (!goal) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-gray-400">Objectif non trouvé</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-100 mb-4">
            {goal.title}
          </h1>
          <p className="text-xl text-gray-400 mb-6">{goal.description}</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center text-gray-300">
              <Clock className="w-5 h-5 mr-2" />
              <span>{goal.estimatedDuration} semaines</span>
            </div>
            <div className="flex items-center">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  getLevelStyle(goal.level).bg
                } ${getLevelStyle(goal.level).color}`}
              >
                {getLevelStyle(goal.level).label}
              </span>
            </div>
          </div>
        </div>

        {/* Prérequis */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Prérequis</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {goal.prerequisites?.map((prereq, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-200 mb-2">
                  {prereq.category}
                </h3>
                <div className="space-y-2">
                  {prereq.skills.map((skill, skillIndex) => {
                    const levelStyle = getLevelStyle(skill.level);
                    return (
                      <div
                        key={skillIndex}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-400">{skill.name}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${levelStyle.bg} ${levelStyle.color}`}
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

        {/* Modules */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Programme</h2>
          <div className="space-y-4">
            {goal.modules?.map((module, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleModule(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-700/50 transition-colors"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-200">
                      {module.title}
                    </h3>
                    <p className="text-gray-400">{module.description}</p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${
                      expandedModules[index] ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedModules[index] && (
                  <div className="px-6 py-4 border-t border-gray-700/50">
                    {/* Durée et compétences */}
                    <div className="mb-4">
                      <div className="flex items-center text-gray-300 mb-4">
                        <Clock className="w-5 h-5 mr-2" />
                        <span>{module.duration} heures</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {module.skills.map((skill, skillIndex) => {
                          const levelStyle = getLevelStyle(skill.level);
                          return (
                            <div
                              key={skillIndex}
                              className={`px-3 py-1 rounded-full text-sm ${levelStyle.bg} ${levelStyle.color}`}
                            >
                              {skill.name}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Ressources */}
                    <div className="space-y-3">
                      <h4 className="text-lg font-semibold text-gray-200 mb-2">
                        Ressources
                      </h4>
                      {module.resources.map((resource, resourceIndex) => {
                        const typeConfig =
                          resourceTypeConfig[
                            resource.type as keyof typeof resourceTypeConfig
                          ];
                        const Icon = typeConfig.icon;
                        return (
                          <a
                            key={resourceIndex}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center p-3 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors group"
                          >
                            <span
                              className={`p-2 rounded-md ${typeConfig.bg} mr-3 group-hover:scale-110 transition-transform`}
                            >
                              <Icon className={`w-4 h-4 ${typeConfig.color}`} />
                            </span>
                            <div className="flex-1">
                              <span className="text-gray-200 group-hover:text-gray-100 transition-colors">
                                {resource.title}
                              </span>
                              <span className="text-sm text-gray-400 block">
                                {resource.duration} minutes
                              </span>
                            </div>
                          </a>
                        );
                      })}
                    </div>

                    {/* Critères de validation */}
                    {module.validationCriteria &&
                      module.validationCriteria.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-lg font-semibold text-gray-200 mb-2">
                            Critères de validation
                          </h4>
                          <ul className="list-disc list-inside text-gray-400 space-y-1">
                            {module.validationCriteria.map(
                              (criteria, criteriaIndex) => (
                                <li key={criteriaIndex}>{criteria}</li>
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

        {/* Débouchés */}
        <div className="glass-card rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-100 mb-6">Débouchés</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {goal.careerOpportunities?.map((opportunity, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-200 mb-2 flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  {opportunity.title}
                </h3>
                <p className="text-gray-400 mb-3">{opportunity.description}</p>
                <div className="flex items-center text-gray-300 mb-2">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span>{opportunity.averageSalary}</span>
                </div>
                <div className="text-sm text-gray-400">
                  Entreprises : {opportunity.companies.join(", ")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certification */}
        {goal.certification?.available && (
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">
              Certification
            </h2>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-200 mb-2 flex items-center">
                <Trophy className="w-5 h-5 mr-2" />
                {goal.certification.name}
              </h3>
              <p className="text-gray-400 mb-3">
                Proposée par {goal.certification.provider}
              </p>
              <a
                href={goal.certification.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
              >
                <GraduationCap className="w-4 h-4 mr-1" />
                En savoir plus
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GoalDetailPage;
