import mongoose from "mongoose";
import { LearningGoal } from "../models/LearningGoal.js";
import { Concept } from "../models/Concept.js";
import { ConceptAssessment } from "../models/ConceptAssessment.js";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

// Ensure we have a MongoDB URI
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ucad_ia";

// Enhanced sample data
const concepts = [
  // Mathematics Fundamentals
  {
    name: "Algèbre Linéaire",
    description: "Fondements de l'algèbre linéaire pour l'IA",
    category: "mathematics",
    level: "basic",
    prerequisites: [],
  },
  {
    name: "Calcul Différentiel",
    description: "Bases du calcul différentiel et optimisation",
    category: "mathematics",
    level: "intermediate",
    prerequisites: ["Algèbre Linéaire"],
  },
  {
    name: "Probabilités et Statistiques",
    description: "Concepts fondamentaux des probabilités et statistiques",
    category: "mathematics",
    level: "intermediate",
    prerequisites: ["Algèbre Linéaire"],
  },
  {
    name: "Optimisation",
    description: "Méthodes d'optimisation pour l'apprentissage automatique",
    category: "mathematics",
    level: "advanced",
    prerequisites: ["Calcul Différentiel", "Algèbre Linéaire"],
  },

  // Programming Fundamentals
  {
    name: "Python pour l'IA",
    description: "Programmation Python orientée data science",
    category: "programming",
    level: "basic",
    prerequisites: [],
  },
  {
    name: "NumPy et Pandas",
    description: "Manipulation de données avec NumPy et Pandas",
    category: "programming",
    level: "intermediate",
    prerequisites: ["Python pour l'IA"],
  },
  {
    name: "Visualisation de Données",
    description: "Techniques de visualisation avec Matplotlib et Seaborn",
    category: "programming",
    level: "intermediate",
    prerequisites: ["NumPy et Pandas"],
  },
  {
    name: "SQL et Bases de Données",
    description: "Gestion et requêtage de bases de données",
    category: "programming",
    level: "intermediate",
    prerequisites: ["Python pour l'IA"],
  },

  // Machine Learning
  {
    name: "Apprentissage Supervisé",
    description: "Fondamentaux du machine learning supervisé",
    category: "ml",
    level: "intermediate",
    prerequisites: ["Probabilités et Statistiques", "NumPy et Pandas"],
  },
  {
    name: "Apprentissage Non Supervisé",
    description: "Techniques de clustering et réduction de dimensionnalité",
    category: "ml",
    level: "intermediate",
    prerequisites: ["Apprentissage Supervisé"],
  },
  {
    name: "Feature Engineering",
    description: "Techniques de préparation et sélection des features",
    category: "ml",
    level: "intermediate",
    prerequisites: ["Apprentissage Supervisé"],
  },
  {
    name: "Validation et Métriques",
    description: "Évaluation et validation des modèles ML",
    category: "ml",
    level: "intermediate",
    prerequisites: ["Apprentissage Supervisé"],
  },

  // Deep Learning
  {
    name: "Deep Learning Fondamental",
    description: "Bases des réseaux de neurones",
    category: "dl",
    level: "intermediate",
    prerequisites: ["Apprentissage Supervisé"],
  },
  {
    name: "CNN",
    description: "Réseaux de neurones convolutifs",
    category: "dl",
    level: "advanced",
    prerequisites: ["Deep Learning Fondamental"],
  },
  {
    name: "RNN et LSTM",
    description: "Réseaux récurrents et mémoire long terme",
    category: "dl",
    level: "advanced",
    prerequisites: ["Deep Learning Fondamental"],
  },
  {
    name: "Transformers",
    description: "Architecture Transformer et attention",
    category: "dl",
    level: "advanced",
    prerequisites: ["RNN et LSTM"],
  },

  // MLOps
  {
    name: "Git et Versioning",
    description: "Gestion de versions pour les projets ML",
    category: "mlops",
    level: "basic",
    prerequisites: ["Python pour l'IA"],
  },
  {
    name: "ML Pipeline Design",
    description: "Conception de pipelines ML robustes",
    category: "mlops",
    level: "intermediate",
    prerequisites: ["Git et Versioning", "Apprentissage Supervisé"],
  },
  {
    name: "Déploiement de Modèles",
    description: "Techniques de déploiement de modèles ML",
    category: "mlops",
    level: "advanced",
    prerequisites: ["ML Pipeline Design"],
  },
];

const learningGoals = [
  // Data Science Track
  {
    title: "Data Scientist Junior",
    description: "Maîtrisez les fondamentaux de la data science",
    category: "data_science",
    estimatedDuration: 12,
    difficulty: "beginner",
    careerOpportunities: [
      "Data Analyst",
      "Junior Data Scientist",
      "Business Intelligence Analyst",
    ],
  },
  {
    title: "Data Scientist Senior",
    description:
      "Approfondissez vos compétences en data science et développez des solutions avancées",
    category: "data_science",
    estimatedDuration: 24,
    difficulty: "advanced",
    careerOpportunities: [
      "Senior Data Scientist",
      "Lead Data Analyst",
      "Data Science Manager",
    ],
  },

  // Machine Learning Track
  {
    title: "ML Engineer",
    description: "Développez et déployez des modèles ML",
    category: "ml",
    estimatedDuration: 16,
    difficulty: "intermediate",
    careerOpportunities: [
      "Machine Learning Engineer",
      "AI Developer",
      "Research Engineer",
    ],
  },
  {
    title: "ML Research Scientist",
    description: "Explorez et développez de nouveaux algorithmes de ML",
    category: "ml",
    estimatedDuration: 28,
    difficulty: "advanced",
    careerOpportunities: [
      "ML Research Scientist",
      "Senior ML Engineer",
      "AI Research Lead",
    ],
  },

  // Deep Learning Track
  {
    title: "Deep Learning Specialist",
    description: "Maîtrisez les architectures de deep learning modernes",
    category: "dl",
    estimatedDuration: 20,
    difficulty: "advanced",
    careerOpportunities: [
      "Deep Learning Engineer",
      "AI Researcher",
      "Computer Vision Engineer",
    ],
  },
  {
    title: "NLP Engineer",
    description: "Spécialisez-vous dans le traitement du langage naturel",
    category: "dl",
    estimatedDuration: 22,
    difficulty: "advanced",
    careerOpportunities: [
      "NLP Engineer",
      "Language AI Specialist",
      "Chatbot Developer",
    ],
  },

  // Computer Vision Track
  {
    title: "Computer Vision Expert",
    description: "Spécialisez-vous en vision par ordinateur",
    category: "dl",
    estimatedDuration: 24,
    difficulty: "advanced",
    careerOpportunities: [
      "Computer Vision Engineer",
      "AI Research Scientist",
      "Robotics Engineer",
    ],
  },
  {
    title: "Robotics Vision Engineer",
    description: "Développez des systèmes de vision pour la robotique",
    category: "dl",
    estimatedDuration: 26,
    difficulty: "advanced",
    careerOpportunities: [
      "Robotics Vision Engineer",
      "Autonomous Systems Engineer",
      "Industrial AI Specialist",
    ],
  },

  // MLOps Track
  {
    title: "MLOps Engineer",
    description: "Gérez le cycle de vie complet des modèles ML",
    category: "mlops",
    estimatedDuration: 16,
    difficulty: "intermediate",
    careerOpportunities: [
      "MLOps Engineer",
      "DevOps Engineer",
      "Platform Engineer",
    ],
  },
  {
    title: "ML Platform Architect",
    description: "Concevez et implémentez des plateformes ML à grande échelle",
    category: "mlops",
    estimatedDuration: 24,
    difficulty: "advanced",
    careerOpportunities: [
      "ML Platform Architect",
      "Senior MLOps Engineer",
      "ML Infrastructure Lead",
    ],
  },

  // AI Product Track
  {
    title: "AI Product Manager",
    description: "Gérez le développement de produits basés sur l'IA",
    category: "ml",
    estimatedDuration: 18,
    difficulty: "intermediate",
    careerOpportunities: [
      "AI Product Manager",
      "ML Product Owner",
      "AI Solutions Architect",
    ],
  },
  {
    title: "AI Solutions Architect",
    description: "Concevez des solutions d'entreprise basées sur l'IA",
    category: "ml",
    estimatedDuration: 22,
    difficulty: "advanced",
    careerOpportunities: [
      "AI Solutions Architect",
      "Enterprise AI Consultant",
      "AI Strategy Lead",
    ],
  },
];

const assessments = [
  // Mathematics Assessments
  {
    conceptName: "Algèbre Linéaire",
    questions: [
      {
        text: "Qu'est-ce qu'une matrice orthogonale ?",
        options: [
          {
            text: "Une matrice carrée dont les colonnes sont orthogonales entre elles",
            isCorrect: true,
          },
          { text: "Une matrice rectangulaire", isCorrect: false },
          {
            text: "Une matrice avec uniquement des 1 et des 0",
            isCorrect: false,
          },
        ],
        explanation:
          "Une matrice orthogonale est une matrice carrée dont les colonnes forment une base orthonormée.",
      },
      {
        text: "Quelle est la propriété principale des vecteurs propres ?",
        options: [
          {
            text: "Ils changent uniquement de magnitude sous la transformation linéaire",
            isCorrect: true,
          },
          {
            text: "Ils sont toujours perpendiculaires entre eux",
            isCorrect: false,
          },
          {
            text: "Ils ont toujours une norme de 1",
            isCorrect: false,
          },
        ],
        explanation:
          "Les vecteurs propres sont des vecteurs qui ne changent que d'échelle (magnitude) sous la transformation linéaire.",
      },
    ],
    passingScore: 70,
    timeLimit: 30,
    difficulty: "basic",
  },

  // Programming Assessments
  {
    conceptName: "Python pour l'IA",
    questions: [
      {
        text: "Quelle est la différence entre une liste et un numpy array ?",
        options: [
          {
            text: "Les numpy arrays sont optimisés pour les calculs numériques",
            isCorrect: true,
          },
          {
            text: "Les listes sont plus rapides pour les calculs matriciels",
            isCorrect: false,
          },
          {
            text: "Il n'y a aucune différence significative",
            isCorrect: false,
          },
        ],
        explanation:
          "Les numpy arrays sont spécialement conçus pour les calculs numériques efficaces et la manipulation de données multidimensionnelles.",
      },
    ],
    passingScore: 70,
    timeLimit: 30,
    difficulty: "basic",
  },

  // Machine Learning Assessments
  {
    conceptName: "Apprentissage Supervisé",
    questions: [
      {
        text: "Quelle est la différence principale entre la régression et la classification ?",
        options: [
          {
            text: "La régression prédit des valeurs continues, la classification des catégories",
            isCorrect: true,
          },
          {
            text: "La régression est plus précise que la classification",
            isCorrect: false,
          },
          {
            text: "La classification utilise toujours des réseaux de neurones",
            isCorrect: false,
          },
        ],
        explanation:
          "La régression prédit des valeurs numériques continues, tandis que la classification prédit des catégories ou classes discrètes.",
      },
    ],
    passingScore: 75,
    timeLimit: 45,
    difficulty: "intermediate",
  },

  // Deep Learning Assessments
  {
    conceptName: "Deep Learning Fondamental",
    questions: [
      {
        text: "Quel est le rôle de la fonction d'activation dans un réseau de neurones ?",
        options: [
          {
            text: "Introduire de la non-linéarité dans le modèle",
            isCorrect: true,
          },
          {
            text: "Accélérer l'apprentissage",
            isCorrect: false,
          },
          {
            text: "Réduire le nombre de paramètres",
            isCorrect: false,
          },
        ],
        explanation:
          "La fonction d'activation introduit de la non-linéarité, permettant au réseau d'apprendre des patterns complexes.",
      },
    ],
    passingScore: 80,
    timeLimit: 60,
    difficulty: "advanced",
  },
];

async function populateDatabase() {
  try {
    logger.info("Attempting to connect to MongoDB at:", MONGODB_URI);

    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info("Connected to MongoDB");

    // Clear existing data
    await Promise.all([
      LearningGoal.deleteMany({}),
      Concept.deleteMany({}),
      ConceptAssessment.deleteMany({}),
    ]);
    logger.info("Cleared existing data");

    // Insert concepts
    const conceptMap = new Map();
    for (const conceptData of concepts) {
      const concept = new Concept({
        ...conceptData,
        prerequisites: [], // We'll update this later
      });
      await concept.save();
      conceptMap.set(concept.name, concept._id);
      logger.info(`Created concept: ${concept.name}`);
    }

    // Update concept prerequisites
    for (const conceptData of concepts) {
      if (conceptData.prerequisites.length > 0) {
        const concept = await Concept.findOne({ name: conceptData.name });
        concept.prerequisites = conceptData.prerequisites.map(name =>
          conceptMap.get(name)
        );
        await concept.save();
        logger.info(`Updated prerequisites for concept: ${concept.name}`);
      }
    }

    // Insert learning goals
    for (const goalData of learningGoals) {
      const goal = new LearningGoal({
        ...goalData,
        requiredConcepts: concepts
          .filter(c => c.category === goalData.category)
          .map(c => conceptMap.get(c.name)),
      });
      await goal.save();
      logger.info(`Created learning goal: ${goal.title}`);
    }

    // Insert assessments
    for (const assessmentData of assessments) {
      const concept = await Concept.findOne({
        name: assessmentData.conceptName,
      });
      if (concept) {
        const assessment = new ConceptAssessment({
          conceptId: concept._id,
          questions: assessmentData.questions,
          passingScore: assessmentData.passingScore,
          timeLimit: assessmentData.timeLimit,
          difficulty: assessmentData.difficulty,
        });
        await assessment.save();

        concept.assessmentTest = assessment._id;
        await concept.save();
        logger.info(`Created assessment for concept: ${concept.name}`);
      }
    }

    logger.info("Database population completed successfully");
  } catch (error) {
    logger.error("Error populating database:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

// Execute the population script
populateDatabase().catch(error => {
  logger.error("Fatal error during database population:", error);
  process.exit(1);
});
