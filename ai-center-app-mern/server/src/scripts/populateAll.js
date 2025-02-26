import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import {
  User,
  Goal,
  Concept,
  ConceptAssessment,
  LearnerProfile,
  Quiz,
} from "../models/index.js";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ucad_ia";

// Données de test pour les utilisateurs
const users = [
  {
    email: "student1@ucad.edu.sn",
    password: "Student123!",
    role: "user",
  },
  {
    email: "student2@ucad.edu.sn",
    password: "Student123!",
    role: "user",
  },
  {
    email: "admin@ucad.edu.sn",
    password: "Admin123!",
    role: "admin",
  },
];

// Données de test pour les quiz
const quizzes = [
  {
    moduleId: "0",
    title: "Introduction au Machine Learning",
    description: "Testez vos connaissances sur les concepts fondamentaux du ML",
    timeLimit: 1800,
    passingScore: 70,
    questions: [
      {
        text: "Quelle est la différence principale entre l'apprentissage supervisé et non supervisé ?",
        options: [
          {
            text: "L'apprentissage supervisé utilise des données étiquetées, l'apprentissage non supervisé non",
            isCorrect: true,
          },
          {
            text: "L'apprentissage supervisé est plus rapide",
            isCorrect: false,
          },
          {
            text: "L'apprentissage non supervisé nécessite plus de données",
            isCorrect: false,
          },
        ],
        explanation:
          "L'apprentissage supervisé utilise des données étiquetées pour entraîner le modèle, tandis que l'apprentissage non supervisé trouve des patterns dans des données non étiquetées.",
      },
      {
        text: "Qu'est-ce que la validation croisée ?",
        options: [
          {
            text: "Une technique pour évaluer la performance d'un modèle sur différents sous-ensembles de données",
            isCorrect: true,
          },
          {
            text: "Une méthode pour nettoyer les données",
            isCorrect: false,
          },
          {
            text: "Un algorithme d'optimisation",
            isCorrect: false,
          },
        ],
        explanation:
          "La validation croisée divise les données en plusieurs sous-ensembles pour évaluer la performance du modèle de manière plus robuste.",
      },
    ],
  },
  {
    moduleId: "1",
    title: "Deep Learning Fondamental",
    description:
      "Évaluez votre compréhension des concepts de base du deep learning",
    timeLimit: 2400,
    passingScore: 75,
    questions: [
      {
        text: "Qu'est-ce qu'une fonction d'activation dans un réseau de neurones ?",
        options: [
          {
            text: "Une fonction qui introduit de la non-linéarité dans le réseau",
            isCorrect: true,
          },
          {
            text: "Une fonction qui initialise les poids",
            isCorrect: false,
          },
          {
            text: "Une fonction qui détermine la taille du réseau",
            isCorrect: false,
          },
        ],
        explanation:
          "La fonction d'activation introduit de la non-linéarité dans le réseau, permettant d'apprendre des patterns complexes.",
      },
    ],
  },
];

// Données de test pour les concepts
const concepts = [
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
    name: "Probabilités",
    description: "Concepts fondamentaux des probabilités",
    category: "mathematics",
    level: "intermediate",
    prerequisites: ["Algèbre Linéaire"],
  },
];

// Données de test pour les objectifs d'apprentissage
const learningGoals = [
  {
    title: "Machine Learning Engineer",
    description: "Maîtrisez les fondamentaux du ML",
    category: "ml",
    estimatedDuration: 12,
    level: "intermediate",
    careerOpportunities: [
      {
        title: "ML Engineer",
        description: "Développement de modèles ML",
        averageSalary: "45-75k€/an",
        companies: ["Google", "Amazon", "Meta"],
      },
    ],
    modules: [
      {
        title: "Introduction au ML",
        description: "Fondamentaux du machine learning",
        duration: 20,
        skills: [
          { name: "Python", level: "basic" },
          { name: "Scikit-learn", level: "basic" },
        ],
        resources: [
          {
            title: "Cours ML Stanford",
            type: "video",
            url: "https://www.coursera.org/learn/machine-learning",
            duration: 120,
          },
        ],
        validationCriteria: [
          "Comprendre les types d'apprentissage",
          "Implémenter un modèle simple",
        ],
      },
    ],
  },
];

// Données de test pour les évaluations
const assessments = [
  {
    conceptName: "Algèbre Linéaire",
    questions: [
      {
        text: "Qu'est-ce qu'une matrice orthogonale ?",
        options: [
          {
            text: "Une matrice carrée dont les colonnes sont orthogonales",
            isCorrect: true,
          },
          {
            text: "Une matrice rectangulaire",
            isCorrect: false,
          },
        ],
        explanation:
          "Une matrice orthogonale a des colonnes orthogonales entre elles.",
      },
    ],
    passingScore: 70,
    timeLimit: 30,
    difficulty: "basic",
  },
];

async function populateDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("Connected to MongoDB");

    // Nettoyer la base de données
    await Promise.all([
      User.deleteMany({}),
      Goal.deleteMany({}),
      Concept.deleteMany({}),
      ConceptAssessment.deleteMany({}),
      LearnerProfile.deleteMany({}),
      Quiz.deleteMany({}),
    ]);
    logger.info("Cleaned existing data");

    // Créer les utilisateurs
    const createdUsers = [];
    for (const userData of users) {
      try {
        // Hasher le mot de passe manuellement
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const user = new User({
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
          isActive: true,
          lastLogin: new Date(),
        });

        const savedUser = await user.save();
        logger.info(`Created user: ${savedUser.email}`);
        createdUsers.push(savedUser);
      } catch (error) {
        logger.error(`Error creating user ${userData.email}:`, error);
        throw error;
      }
    }

    // Créer les concepts
    const conceptMap = new Map();
    for (const conceptData of concepts) {
      const concept = new Concept({
        ...conceptData,
        prerequisites: [],
      });
      await concept.save();
      conceptMap.set(concept.name, concept._id);
      logger.info(`Created concept: ${concept.name}`);
    }

    // Mettre à jour les prérequis des concepts
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

    // Créer les objectifs d'apprentissage
    const createdGoals = await Promise.all(
      learningGoals.map(async goalData => {
        const goal = new Goal({
          ...goalData,
          requiredConcepts: concepts
            .filter(c => c.category === goalData.category)
            .map(c => conceptMap.get(c.name)),
        });
        const savedGoal = await goal.save();
        logger.info(`Created learning goal: ${savedGoal.title}`);
        return savedGoal;
      })
    );

    // Créer les quiz
    for (const quizData of quizzes) {
      const quiz = new Quiz(quizData);
      await quiz.save();
      logger.info(`Created quiz: ${quiz.title} for module ${quiz.moduleId}`);
    }

    // Créer les évaluations
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
        logger.info(`Created assessment for concept: ${concept.name}`);
      }
    }

    // Créer les profils apprenants pour les utilisateurs non-admin
    for (const user of createdUsers) {
      if (user.role === "user") {
        const profile = new LearnerProfile({
          userId: user._id,
          learningStyle: "visual",
          preferences: {
            mathLevel: "intermediate",
            programmingLevel: "intermediate",
            preferredDomain: "ml",
          },
          assessments: [
            {
              category: "ml",
              score: 75,
              completedAt: new Date(),
              responses: [],
              recommendations: [],
            },
          ],
        });
        await profile.save();
        logger.info(`Created learner profile for user: ${user.email}`);
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

// Exécuter le script
populateDatabase().catch(error => {
  logger.error("Fatal error during database population:", error);
  process.exit(1);
});
