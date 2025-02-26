import mongoose from "mongoose";
import { Goal, Quiz } from "../models/index.js";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ucad_ia";

// Nouveaux objectifs d'apprentissage
const additionalGoals = [
  {
    title: "ML Engineer - Time Series",
    description:
      "Spécialisation en analyse et prédiction de séries temporelles",
    category: "ml",
    level: "advanced",
    estimatedDuration: 14,
    careerOpportunities: [
      {
        title: "Time Series Specialist",
        description:
          "Développement de modèles prédictifs pour séries temporelles",
        averageSalary: "50-80k€/an",
        companies: ["Bloomberg", "Trading Firms", "EDF"],
      },
    ],
    modules: [
      {
        title: "Fondamentaux des Séries Temporelles",
        description: "Concepts et techniques de base",
        duration: 25,
        skills: [
          { name: "Python", level: "intermediate" },
          { name: "Pandas", level: "intermediate" },
          { name: "Statsmodels", level: "basic" },
        ],
        resources: [
          {
            title: "Time Series Analysis with Python",
            type: "tutorial",
            url: "https://www.coursera.org/learn/time-series-analysis",
            duration: 120,
          },
        ],
        validationCriteria: [
          "Comprendre les composantes d'une série temporelle",
          "Implémenter des modèles ARIMA",
        ],
      },
    ],
  },
  {
    title: "ML Engineer - Recommendation Systems",
    description: "Expert en systèmes de recommandation",
    category: "ml",
    level: "intermediate",
    estimatedDuration: 12,
    careerOpportunities: [
      {
        title: "Recommendation Systems Engineer",
        description: "Conception de systèmes de recommandation",
        averageSalary: "45-75k€/an",
        companies: ["Netflix", "Spotify", "Amazon"],
      },
    ],
    modules: [
      {
        title: "Systèmes de Recommandation",
        description: "Algorithmes de filtrage collaboratif et content-based",
        duration: 30,
        skills: [
          { name: "Python", level: "intermediate" },
          { name: "Surprise", level: "intermediate" },
        ],
        resources: [
          {
            title: "Recommender Systems Specialization",
            type: "video",
            url: "https://www.coursera.org/specializations/recommender-systems",
            duration: 150,
          },
        ],
        validationCriteria: [
          "Implémenter un système de filtrage collaboratif",
          "Évaluer la performance des recommandations",
        ],
      },
    ],
  },
  {
    title: "Deep Learning Specialist - Transformers",
    description: "Expert en architectures Transformer",
    category: "dl",
    level: "advanced",
    estimatedDuration: 16,
    careerOpportunities: [
      {
        title: "Deep Learning Research Engineer",
        description: "R&D en architectures Transformer",
        averageSalary: "60-90k€/an",
        companies: ["Google Brain", "DeepMind", "Meta AI"],
      },
    ],
    modules: [
      {
        title: "Architecture Transformer",
        description: "Mécanisme d'attention et architectures modernes",
        duration: 35,
        skills: [
          { name: "PyTorch", level: "advanced" },
          { name: "Transformers", level: "advanced" },
        ],
        resources: [
          {
            title: "Transformer Architecture Deep Dive",
            type: "tutorial",
            url: "https://www.coursera.org/learn/transformer-architecture",
            duration: 180,
          },
        ],
        validationCriteria: [
          "Comprendre le mécanisme d'attention",
          "Implémenter un Transformer from scratch",
        ],
      },
    ],
  },
];

// Nouveaux quiz
const additionalQuizzes = [
  {
    moduleId: "time_series_1",
    title: "Fondamentaux des Séries Temporelles",
    description: "Évaluez vos connaissances en analyse de séries temporelles",
    timeLimit: 1800,
    passingScore: 70,
    questions: [
      {
        text: "Qu'est-ce que la stationnarité dans une série temporelle ?",
        options: [
          {
            text: "Les propriétés statistiques (moyenne, variance) restent constantes dans le temps",
            isCorrect: true,
          },
          {
            text: "La série ne change jamais de valeur",
            isCorrect: false,
          },
          {
            text: "La série augmente constamment",
            isCorrect: false,
          },
        ],
        explanation:
          "Une série stationnaire a des propriétés statistiques qui ne varient pas dans le temps, ce qui est important pour de nombreuses analyses.",
      },
      {
        text: "Quel test est utilisé pour vérifier la stationnarité ?",
        options: [
          {
            text: "Test de Dickey-Fuller augmenté",
            isCorrect: true,
          },
          {
            text: "Test du Chi-carré",
            isCorrect: false,
          },
          {
            text: "Test de Student",
            isCorrect: false,
          },
        ],
        explanation:
          "Le test de Dickey-Fuller augmenté est couramment utilisé pour tester la présence d'une racine unitaire et donc la non-stationnarité.",
      },
      {
        text: "Que signifie la saisonnalité dans une série temporelle ?",
        options: [
          {
            text: "Des patterns qui se répètent à intervalles réguliers",
            isCorrect: true,
          },
          {
            text: "Une tendance à la hausse",
            isCorrect: false,
          },
          {
            text: "Des valeurs manquantes",
            isCorrect: false,
          },
        ],
        explanation:
          "La saisonnalité représente des motifs cycliques qui se répètent à intervalles réguliers, comme les variations annuelles.",
      },
    ],
  },
  {
    moduleId: "transformer_1",
    title: "Architecture Transformer",
    description: "Testez votre compréhension des Transformers",
    timeLimit: 2400,
    passingScore: 75,
    questions: [
      {
        text: "Quel est l'avantage principal du mécanisme d'attention par rapport aux RNNs ?",
        options: [
          {
            text: "Il peut traiter toutes les positions en parallèle et capturer les dépendances à longue distance",
            isCorrect: true,
          },
          {
            text: "Il utilise moins de mémoire",
            isCorrect: false,
          },
          {
            text: "Il est plus simple à implémenter",
            isCorrect: false,
          },
        ],
        explanation:
          "Le mécanisme d'attention permet un traitement parallèle et capture efficacement les dépendances à longue distance, contrairement aux RNNs séquentiels.",
      },
      {
        text: "Qu'est-ce que le 'positional encoding' dans un Transformer ?",
        options: [
          {
            text: "Un moyen d'injecter l'information sur la position des tokens dans la séquence",
            isCorrect: true,
          },
          {
            text: "Une technique de normalisation",
            isCorrect: false,
          },
          {
            text: "Un type de fonction d'activation",
            isCorrect: false,
          },
        ],
        explanation:
          "Le positional encoding permet au modèle de prendre en compte l'ordre des mots dans la séquence, ce qui est crucial car l'attention n'a pas de notion d'ordre intrinsèque.",
      },
      {
        text: "Pourquoi utilise-t-on l'attention multi-têtes ?",
        options: [
          {
            text: "Pour permettre au modèle de se concentrer sur différents aspects de l'entrée en parallèle",
            isCorrect: true,
          },
          {
            text: "Pour réduire le temps de calcul",
            isCorrect: false,
          },
          {
            text: "Pour économiser de la mémoire",
            isCorrect: false,
          },
        ],
        explanation:
          "L'attention multi-têtes permet au modèle de capturer différents types de relations et patterns dans les données en parallèle.",
      },
      {
        text: "Qu'est-ce que le masquage dans l'attention ?",
        options: [
          {
            text: "Une technique pour empêcher le modèle de voir les tokens futurs lors du décodage",
            isCorrect: true,
          },
          {
            text: "Une méthode de dropout",
            isCorrect: false,
          },
          {
            text: "Une technique de régularisation",
            isCorrect: false,
          },
        ],
        explanation:
          "Le masquage est utilisé dans le décodeur pour empêcher le modèle d'utiliser des informations futures lors de la génération, préservant ainsi l'auto-régression.",
      },
    ],
  },
];

async function populateGoalsAndQuizzes() {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("Connected to MongoDB");

    // Ajouter les nouveaux objectifs
    for (const goalData of additionalGoals) {
      const goal = new Goal(goalData);
      await goal.save();
      logger.info(`Created new goal: ${goal.title}`);
    }

    // Ajouter les nouveaux quiz
    for (const quizData of additionalQuizzes) {
      const quiz = new Quiz(quizData);
      await quiz.save();
      logger.info(`Created new quiz: ${quiz.title}`);
    }

    logger.info("Successfully added new goals and quizzes");
  } catch (error) {
    logger.error("Error adding goals and quizzes:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

// Exécuter le script
populateGoalsAndQuizzes().catch(error => {
  logger.error("Fatal error during data population:", error);
  process.exit(1);
});
