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

type DomainKey =
  | "Machine Learning"
  | "Deep Learning"
  | "Computer Vision"
  | "NLP"
  | "MLOps";
type DomainValue = "ml" | "dl" | "computer_vision" | "nlp" | "mlops";

const DOMAIN_MAPPING: Record<DomainKey, DomainValue> = {
  "Machine Learning": "ml",
  "Deep Learning": "dl",
  "Computer Vision": "computer_vision",
  NLP: "nlp",
  MLOps: "mlops",
};

// Mapping des niveaux affichés vers les valeurs d'énumération
const LEVEL_MAPPING: Record<string, string> = {
  "Débutant (bases d'algèbre et calcul)": "beginner",
  "Intermédiaire (calcul matriciel, probabilités)": "intermediate",
  "Avancé (optimisation, statistiques avancées)": "advanced",
  "Expert (théorie approfondie)": "expert",
  "Débutant (notions de base)": "beginner",
  "Intermédiaire (fonctions, classes, bibliothèques)": "intermediate",
  "Avancé (frameworks, projets complexes)": "advanced",
  "Expert (contribution open source, optimisation)": "expert",
};

const AssessmentPage = () => {
  const navigate = useNavigate();
  const {
    user,
    isAuthenticated,
    hasCompletedAssessment,
    checkAssessmentStatus,
  } = useAuth();
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

  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem("redirectAfterLogin", "/assessment");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

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
    setUserProfile(prev => ({
      ...prev,
      mathLevel: LEVEL_MAPPING[level] || level,
    }));
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
    setUserProfile(prev => ({
      ...prev,
      programmingLevel: LEVEL_MAPPING[level] || level,
    }));
    addUserMessage(level);

    setCurrentStep("domain");
    await addBotMessage(
      "Super ! Pour mieux vous orienter, quel domaine de l'IA vous intéresse le plus ?",
      ["Machine Learning", "Deep Learning", "Computer Vision", "NLP", "MLOps"]
    );
  };

  const handleDomainSelection = async (domain: DomainKey) => {
    const mappedDomain = DOMAIN_MAPPING[domain];
    setUserProfile(prev => ({ ...prev, domain: mappedDomain }));
    addUserMessage(domain);

    setLoading(true);
    try {
      const response = await fetch(
        `${api.assessmentQuestions}?domain=${mappedDomain}`
      );
      if (!response.ok)
        throw new Error("Erreur lors du chargement des questions");
      const data = await response.json();

      if (!data || data.length === 0) {
        const defaultQuestions = DEFAULT_QUESTIONS.filter(
          q => q.category === mappedDomain
        );
        setQuestions(defaultQuestions);
      } else {
        setQuestions(data);
      }
    } catch (error) {
      console.error("Error loading questions:", error);
      const defaultQuestions = DEFAULT_QUESTIONS.filter(
        q => q.category === mappedDomain
      );
      setQuestions(defaultQuestions);
    } finally {
      setLoading(false);
    }

    const recommendations = getInitialRecommendations(
      userProfile.mathLevel,
      userProfile.programmingLevel,
      mappedDomain
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

    if (mathLevel.includes("beginner")) {
      recommendations.push(
        "• Renforcement recommandé en mathématiques fondamentales"
      );
    }

    if (programmingLevel.includes("beginner")) {
      recommendations.push(
        "• Focus initial sur les bases de Python et ses bibliothèques"
      );
    }

    switch (domain) {
      case "ml":
        recommendations.push(
          "• Parcours orienté algorithmes classiques et statistiques"
        );
        break;
      case "dl":
        recommendations.push(
          "• Accent sur les architectures de réseaux neuronaux"
        );
        break;
      case "computer_vision":
        recommendations.push("• Focus sur le traitement d'images et les CNNs");
        break;
      case "nlp":
        recommendations.push(
          "• Orientation vers le traitement du langage naturel"
        );
        break;
      case "mlops":
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

    if (isAuthenticated && user) {
      try {
        // Sauvegarder les résultats de l'évaluation
        const assessmentResponse = await fetch(`${api.assessments}/submit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            category: userProfile.domain,
            score,
            responses,
            recommendations,
          }),
        });

        if (!assessmentResponse.ok) {
          throw new Error("Erreur lors de la sauvegarde des résultats");
        }

        // Mettre à jour le profil utilisateur
        const profileResponse = await fetch(`${api.profiles}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            learningStyle: "visual",
            preferences: {
              mathLevel: userProfile.mathLevel,
              programmingLevel: userProfile.programmingLevel,
              preferredDomain: userProfile.domain,
            },
          }),
        });

        if (!profileResponse.ok) {
          throw new Error("Erreur lors de la mise à jour du profil");
        }

        // Mettre à jour le statut de l'évaluation
        await checkAssessmentStatus();

        // Rediriger vers les objectifs
        toast.success(
          "Évaluation terminée ! Redirection vers vos objectifs personnalisés..."
        );
        navigate("/goals");
      } catch (error) {
        console.error("Error saving assessment results:", error);
        toast.error("Erreur lors de la sauvegarde des résultats");
      }
    }
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

      case "Se connecter":
        navigate("/login");
        break;

      case "Revenir à l'accueil":
        navigate("/");
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
            await handleDomainSelection(option as DomainKey);
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
