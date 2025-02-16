import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import ChatInterface from "../components/ChatInterface";
import { Message, Question } from "../types";
import QuizComponent from "../components/QuizComponent";
import {
  calculateDetailedScore,
  generateRecommendations,
} from "../utils/scoringSystem";
import { api } from "../config/api";
import { DEFAULT_QUESTIONS } from "../data/questions";

const AssessmentPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-message",
      type: "bot",
      content:
        "Bonjour ! Je suis votre assistant d'évaluation en IA. Que souhaitez-vous faire ?",
      options: ["Commencer l'évaluation", "En savoir plus"],
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "intro" | "math" | "programming" | "domain" | "quiz" | "results"
  >("intro");
  const [userProfile, setUserProfile] = useState({
    mathLevel: "",
    programmingLevel: "",
    domain: "",
  });
  const [quizStarted, setQuizStarted] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState<any>(null);

  const generateMessageId = useCallback((prefix: string) => {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const addMessage = useCallback(
    (message: Partial<Message>) => {
      const newMessage: Message = {
        id: generateMessageId(message.type === "bot" ? "bot" : "user"),
        type: message.type || "user",
        content: message.content || "",
        options: message.options,
        component: message.component,
      };
      setMessages(prev => [...prev, newMessage]);
    },
    [generateMessageId]
  );

  const addBotMessage = useCallback(
    async (
      content: string,
      options?: string[],
      component?: React.ReactNode
    ) => {
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      addMessage({
        type: "bot",
        content,
        options,
        component,
      });

      setIsTyping(false);
    },
    [addMessage]
  );

  const addUserMessage = useCallback(
    (content: string) => {
      addMessage({
        type: "user",
        content,
      });
    },
    [addMessage]
  );

  const handleMathLevel = async (level: string) => {
    setUserProfile(prev => ({ ...prev, mathLevel: level }));
    addUserMessage(level);

    setCurrentStep("programming");
    await addBotMessage(
      "Excellent ! Maintenant, parlons de votre expérience en programmation Python :",
      [
        "Débutant (notions de base)",
        "Intermédiaire (fonctions, classes, bibliothèques)",
        "Avancé (frameworks, projets complexes)",
        "Expert (contribution open source, optimisation)",
      ]
    );
  };

  const handleProgrammingLevel = async (level: string) => {
    setUserProfile(prev => ({ ...prev, programmingLevel: level }));
    addUserMessage(level);

    setCurrentStep("domain");
    await addBotMessage(
      "Super ! Pour mieux vous orienter, quel domaine de l'IA vous intéresse le plus ?",
      ["Machine Learning", "Deep Learning", "Computer Vision", "NLP", "MLOps"]
    );
  };

  const handleDomainSelection = async (domain: string) => {
    setUserProfile(prev => ({ ...prev, domain }));
    addUserMessage(domain);

    setLoading(true);
    try {
      const response = await fetch(`${api.assessmentQuestions(domain)}`);
      if (!response.ok)
        throw new Error("Erreur lors du chargement des questions");
      const data = await response.json();

      // Si l'API ne retourne pas de questions, utiliser les questions par défaut
      if (!data || data.length === 0) {
        const domainLower = domain.toLowerCase();
        const defaultQuestions = DEFAULT_QUESTIONS.filter(
          q =>
            q.category.toLowerCase() === domainLower ||
            (domainLower === "machine learning" && q.category === "ml") ||
            (domainLower === "deep learning" && q.category === "dl")
        );
        setQuestions(defaultQuestions);
      } else {
        setQuestions(data);
      }
    } catch (error) {
      console.error("Error loading questions:", error);
      // En cas d'erreur, utiliser les questions par défaut
      const domainLower = domain.toLowerCase();
      const defaultQuestions = DEFAULT_QUESTIONS.filter(
        q =>
          q.category.toLowerCase() === domainLower ||
          (domainLower === "machine learning" && q.category === "ml") ||
          (domainLower === "deep learning" && q.category === "dl")
      );
      setQuestions(defaultQuestions);
    } finally {
      setLoading(false);
    }

    const recommendations = getInitialRecommendations(
      userProfile.mathLevel,
      userProfile.programmingLevel,
      domain
    );

    await addBotMessage(
      `Voici une première analyse de votre profil :\n\n${recommendations}\n\nSouhaitez-vous passer à l'évaluation détaillée pour obtenir un parcours personnalisé ?`,
      ["Commencer l'évaluation détaillée", "Revenir plus tard"]
    );
  };

  const getInitialRecommendations = (
    mathLevel: string,
    programmingLevel: string,
    domain: string
  ) => {
    let recommendations = [];

    if (mathLevel.includes("Débutant")) {
      recommendations.push(
        "• Renforcement recommandé en mathématiques fondamentales"
      );
    }

    if (programmingLevel.includes("Débutant")) {
      recommendations.push(
        "• Focus initial sur les bases de Python et ses bibliothèques"
      );
    }

    switch (domain) {
      case "Machine Learning":
        recommendations.push(
          "• Parcours orienté algorithmes classiques et statistiques"
        );
        break;
      case "Deep Learning":
        recommendations.push(
          "• Accent sur les architectures de réseaux neuronaux"
        );
        break;
      case "Computer Vision":
        recommendations.push("• Focus sur le traitement d'images et les CNNs");
        break;
      case "NLP":
        recommendations.push(
          "• Orientation vers le traitement du langage naturel"
        );
        break;
      case "MLOps":
        recommendations.push(
          "• Concentration sur le déploiement et la maintenance"
        );
        break;
    }

    return recommendations.join("\n");
  };

  const handleQuizStart = async () => {
    setQuizStarted(true);
    setCurrentStep("quiz");

    if (loading) {
      await addBotMessage("Préparation de votre évaluation personnalisée...");
      return;
    }

    if (questions.length === 0) {
      await addBotMessage(
        "Je suis désolé, mais je n'ai pas encore de questions disponibles pour votre profil. Nous travaillons à enrichir notre base de questions. En attendant, je vous invite à explorer les parcours recommandés basés sur votre profil initial.",
        ["Explorer les parcours", "Revenir à l'accueil"]
      );
      return;
    }

    await addBotMessage(
      "Parfait ! L'évaluation détaillée commence. Les questions sont adaptées à votre profil et au domaine choisi.",
      undefined,
      <QuizComponent questions={questions} onComplete={handleQuizComplete} />
    );
  };

  const handleQuizComplete = async (score: number, responses: any[]) => {
    setCurrentStep("results");

    const categoryScores = calculateDetailedScore(questions, responses);
    const recommendations = generateRecommendations(
      categoryScores,
      userProfile
    );

    // Save results in state
    setAssessmentResults({
      profile: userProfile,
      categoryScores,
      recommendations,
      responses,
    });

    // If user is authenticated, save results to backend
    if (isAuthenticated && user) {
      try {
        const response = await fetch(`${api.assessments}/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            category: userProfile.domain.toLowerCase(),
            score,
            responses,
            recommendations,
          }),
        });

        if (!response.ok) {
          console.warn(
            "Failed to save assessment results, but continuing with display"
          );
        }
      } catch (error) {
        console.warn("Failed to save assessment results:", error);
      }
    }

    // Display results
    await addBotMessage(
      "Voici votre évaluation détaillée :",
      undefined,
      <div className="mt-4 space-y-6">
        {/* Profil */}
        <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold text-gray-100 mb-4">Votre Profil</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Niveau en mathématiques</span>
              <span className="text-purple-400">{userProfile.mathLevel}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Niveau en programmation</span>
              <span className="text-purple-400">
                {userProfile.programmingLevel}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Domaine d'intérêt</span>
              <span className="text-purple-400">{userProfile.domain}</span>
            </div>
          </div>
        </div>

        {/* Scores */}
        <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold text-gray-100 mb-4">
            Résultats par Domaine
          </h3>
          {recommendations.map((result, index) => (
            <div key={index} className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">{result.category}</span>
                <span className="text-lg font-semibold text-purple-400">
                  {Math.round(result.score)}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${result.score}%` }}
                />
              </div>
              <div className="space-y-2">
                {result.recommendations.map((rec, i) => (
                  <p key={i} className="text-sm text-gray-400">
                    • {rec}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700">
          <h3 className="text-xl font-bold text-gray-100 mb-4">
            Prochaines Étapes
          </h3>
          <div className="space-y-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate("/goals")}
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Voir les parcours recommandés
              </button>
            ) : (
              <>
                <button
                  onClick={() =>
                    navigate("/login", {
                      state: {
                        from: "/goals",
                        assessmentResults: {
                          profile: userProfile,
                          scores: categoryScores,
                          recommendations,
                          responses,
                        },
                      },
                    })
                  }
                  className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Se connecter pour voir les parcours recommandés
                </button>
                <p className="text-sm text-gray-400 text-center">
                  Connectez-vous pour sauvegarder vos résultats et accéder à
                  votre parcours personnalisé
                </p>
              </>
            )}
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 px-4 border border-gray-600 hover:bg-gray-800 text-gray-300 rounded-lg transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleSend = async (message: string) => {
    addUserMessage(message);

    switch (currentStep) {
      case "math":
        await addBotMessage(
          "Pour une évaluation précise, veuillez choisir votre niveau en mathématiques parmi les options proposées :",
          [
            "Débutant (bases d'algèbre et calcul)",
            "Intermédiaire (calcul matriciel, probabilités)",
            "Avancé (optimisation, statistiques avancées)",
            "Expert (théorie approfondie)",
          ]
        );
        break;
      case "programming":
        await addBotMessage(
          "Veuillez sélectionner votre niveau en programmation :",
          [
            "Débutant (notions de base)",
            "Intermédiaire (fonctions, classes, bibliothèques)",
            "Avancé (frameworks, projets complexes)",
            "Expert (contribution open source, optimisation)",
          ]
        );
        break;
      case "domain":
        await addBotMessage("Choisissez votre domaine d'intérêt :", [
          "Machine Learning",
          "Deep Learning",
          "Computer Vision",
          "NLP",
          "MLOps",
        ]);
        break;
      default:
        await addBotMessage(
          "Je vous invite à choisir parmi les options proposées pour avancer dans l'évaluation.",
          ["Commencer l'évaluation", "En savoir plus"]
        );
    }
  };

  const handleOptionSelect = async (option: string) => {
    addUserMessage(option);

    switch (option) {
      case "Commencer l'évaluation":
        setCurrentStep("math");
        await addBotMessage(
          "Pour commencer, quel est votre niveau en mathématiques ?",
          [
            "Débutant (bases d'algèbre et calcul)",
            "Intermédiaire (calcul matriciel, probabilités)",
            "Avancé (optimisation, statistiques avancées)",
            "Expert (théorie approfondie)",
          ]
        );
        break;

      case "En savoir plus":
        await addBotMessage(
          "L'évaluation se déroule en plusieurs étapes :\n\n" +
            "1. Évaluation de votre niveau en mathématiques\n" +
            "2. Évaluation de vos compétences en programmation\n" +
            "3. Identification de vos centres d'intérêt\n" +
            "4. Test adaptatif personnalisé\n" +
            "5. Recommandations détaillées\n\n" +
            "Prêt à commencer ?",
          ["Commencer l'évaluation", "Revenir plus tard"]
        );
        break;

      case "Revenir plus tard":
        navigate("/");
        break;

      case "Explorer les parcours":
        navigate("/goals");
        break;

      case "Commencer l'évaluation détaillée":
        await handleQuizStart();
        break;

      default:
        switch (currentStep) {
          case "math":
            await handleMathLevel(option);
            break;
          case "programming":
            await handleProgrammingLevel(option);
            break;
          case "domain":
            await handleDomainSelection(option);
            break;
        }
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">
            Évaluation Personnalisée
          </h1>
          <p className="mt-2 text-gray-400">
            Découvrez votre niveau et obtenez des recommandations sur mesure
          </p>
        </div>

        <ChatInterface
          messages={messages}
          onSend={handleSend}
          onOptionSelect={handleOptionSelect}
          isTyping={isTyping}
        />
      </div>
    </div>
  );
};

export default AssessmentPage;
