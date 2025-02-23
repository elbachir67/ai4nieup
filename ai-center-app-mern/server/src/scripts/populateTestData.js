import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Goal } from "../models/LearningGoal.js";
import { Concept } from "../models/Concept.js";
import { ConceptAssessment } from "../models/ConceptAssessment.js";
import { LearnerProfile } from "../models/LearnerProfile.js";
import { Pathway } from "../models/Pathway.js";
import { LearningData } from "../models/LearningData.js";
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
            type: "video", // Changé de 'course' à 'video'
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
  {
    title: "Deep Learning Specialist",
    description: "Spécialisez-vous en deep learning",
    category: "dl",
    estimatedDuration: 16,
    level: "advanced",
    careerOpportunities: [
      {
        title: "DL Engineer",
        description: "Conception de réseaux de neurones",
        averageSalary: "50-85k€/an",
        companies: ["OpenAI", "DeepMind", "Google Brain"],
      },
    ],
    modules: [
      {
        title: "Réseaux de Neurones",
        description: "Fondamentaux des réseaux de neurones",
        duration: 25,
        skills: [
          { name: "PyTorch", level: "intermediate" },
          { name: "Backpropagation", level: "intermediate" },
        ],
        resources: [
          {
            title: "Deep Learning Book",
            type: "book", // 'book' est un type valide
            url: "https://www.deeplearningbook.org/",
            duration: 180,
          },
        ],
        validationCriteria: [
          "Comprendre l'architecture des réseaux",
          "Implémenter un réseau simple",
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

async function populateTestData() {
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
      Pathway.deleteMany({}),
      LearningData.deleteMany({}),
    ]);
    logger.info("Cleaned existing data");

    // Créer les utilisateurs
    const createdUsers = [];
    for (const userData of users) {
      try {
        const user = new User({
          email: userData.email,
          password: userData.password,
          role: userData.role,
          isActive: true,
          lastLogin: new Date(),
        });

        const savedUser = await user.save();
        logger.info(`Created user: ${savedUser.email}`);

        // Vérifier l'authentification
        const testAuth = await User.findByCredentials(
          userData.email,
          userData.password
        );
        logger.info(
          `Test authentication successful for user: ${testAuth.email}`
        );

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
    const createdGoals = [];
    for (const goalData of learningGoals) {
      const goal = new Goal({
        ...goalData,
        requiredConcepts: concepts
          .filter(c => c.category === goalData.category)
          .map(c => conceptMap.get(c.name)),
      });
      const savedGoal = await goal.save();
      createdGoals.push(savedGoal);
      logger.info(`Created learning goal: ${savedGoal.title}`);
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

        // Créer un parcours d'apprentissage
        if (createdGoals.length > 0) {
          const pathway = new Pathway({
            userId: user._id,
            goalId: createdGoals[0]._id,
            status: "active",
            progress: 0,
            currentModule: 0,
            moduleProgress: [
              {
                moduleIndex: 0,
                completed: false,
                resources: [],
                quiz: { completed: false },
              },
            ],
            startedAt: new Date(),
            lastAccessedAt: new Date(),
            estimatedCompletionDate: new Date(
              Date.now() + 90 * 24 * 60 * 60 * 1000
            ), // +90 jours
          });
          await pathway.save();
          logger.info(`Created learning pathway for user: ${user.email}`);
        }
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
populateTestData().catch(error => {
  logger.error("Fatal error during database population:", error);
  process.exit(1);
});
