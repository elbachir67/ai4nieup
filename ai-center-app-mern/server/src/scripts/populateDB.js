import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { LearningGoal } from "../models/LearningGoal.js";
import { Concept } from "../models/Concept.js";
import { ConceptAssessment } from "../models/ConceptAssessment.js";
import { LearnerProfile } from "../models/LearnerProfile.js";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Verify critical environment variables
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  logger.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`
  );
  process.exit(1);
}

// Ensure we have a MongoDB URI
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ucad_ia";

// Sample users data with more secure passwords
const users = [
  {
    email: "admin@ucad.edu.sn",
    password: "admin123", // Will be hashed
    role: "admin",
  },
  {
    email: "student1@ucad.edu.sn",
    password: "Student123!", // More secure password
    role: "user",
  },
  {
    email: "student2@ucad.edu.sn",
    password: "Student456!", // More secure password
    role: "user",
  },
];

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
    name: "Transformers",
    description: "Architecture Transformer et attention",
    category: "dl",
    level: "advanced",
    prerequisites: ["Deep Learning Fondamental"],
  },
];

const learningGoals = [
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
          {
            text: "Une matrice rectangulaire",
            isCorrect: false,
          },
          {
            text: "Une matrice avec uniquement des 1 et des 0",
            isCorrect: false,
          },
        ],
        explanation:
          "Une matrice orthogonale est une matrice carrée dont les colonnes forment une base orthonormée.",
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
          "Les numpy arrays sont spécialement conçus pour les calculs numériques efficaces.",
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
          "La régression prédit des valeurs numériques continues, tandis que la classification prédit des catégories discrètes.",
      },
    ],
    passingScore: 75,
    timeLimit: 45,
    difficulty: "intermediate",
  },
];

async function populateDatabase() {
  try {
    logger.info("Attempting to connect to MongoDB at:", MONGODB_URI);
    await mongoose.connect(MONGODB_URI);
    logger.info("Connected to MongoDB");

    // Clear ALL existing data
    await Promise.all([
      User.deleteMany({}),
      LearnerProfile.deleteMany({}),
      LearningGoal.deleteMany({}),
      Concept.deleteMany({}),
      ConceptAssessment.deleteMany({}),
    ]);
    logger.info("Cleared all existing data");

    // Create users and their profiles
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        email: userData.email,
        password: hashedPassword,
        role: userData.role,
      });
      await user.save();
      logger.info(`Created user: ${user.email} (${user.role})`);

      // Create learner profile for non-admin users
      if (userData.role === "user") {
        const learnerProfile = new LearnerProfile({
          userId: user._id,
          learningStyle: "visual",
          preferences: {
            mathLevel: "beginner",
            programmingLevel: "beginner",
            preferredDomain: "ml",
          },
        });
        await learnerProfile.save();
        logger.info(`Created learner profile for user: ${user.email}`);
      }
    }

    // Insert concepts with prerequisites handling
    const conceptMap = new Map();
    for (const conceptData of concepts) {
      const concept = new Concept({
        ...conceptData,
        prerequisites: [], // Initially empty, will update later
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

    // Insert learning goals with concept references
    for (const goalData of learningGoals) {
      const goal = new LearningGoal({
        ...goalData,
        requiredConcepts: concepts
          .filter(c => c.category === goalData.category)
          .map(c => conceptMap.get(c.name))
          .filter(id => id), // Remove any undefined values
      });
      await goal.save();
      logger.info(`Created learning goal: ${goal.title}`);
    }

    // Insert concept assessments
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

        // Update concept with assessment reference
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
