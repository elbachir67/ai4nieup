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
      {
        text: "Quel algorithme est couramment utilisé pour la classification binaire ?",
        options: [
          {
            text: "Régression logistique",
            isCorrect: true,
          },
          {
            text: "K-means",
            isCorrect: false,
          },
          {
            text: "PCA",
            isCorrect: false,
          },
        ],
        explanation:
          "La régression logistique est un algorithme couramment utilisé pour la classification binaire.",
      },
      {
        text: "Quelle métrique est appropriée pour évaluer un modèle de classification déséquilibrée ?",
        options: [
          {
            text: "F1-score",
            isCorrect: true,
          },
          {
            text: "Accuracy",
            isCorrect: false,
          },
          {
            text: "Mean Squared Error",
            isCorrect: false,
          },
        ],
        explanation:
          "Le F1-score est particulièrement utile pour les problèmes de classification déséquilibrée car il prend en compte à la fois la précision et le rappel.",
      },
      {
        text: "Qu'est-ce que le surapprentissage (overfitting) ?",
        options: [
          {
            text: "Le modèle apprend trop bien les données d'entraînement et généralise mal",
            isCorrect: true,
          },
          {
            text: "Le modèle n'apprend pas assez des données d'entraînement",
            isCorrect: false,
          },
          {
            text: "Le modèle prend trop de temps à s'entraîner",
            isCorrect: false,
          },
        ],
        explanation:
          "Le surapprentissage se produit lorsqu'un modèle apprend trop spécifiquement les données d'entraînement et perd en capacité de généralisation.",
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
      {
        text: "Quel est le rôle du dropout dans un réseau de neurones ?",
        options: [
          {
            text: "Prévenir le surapprentissage en désactivant aléatoirement des neurones",
            isCorrect: true,
          },
          {
            text: "Accélérer l'apprentissage",
            isCorrect: false,
          },
          {
            text: "Réduire la taille du modèle",
            isCorrect: false,
          },
        ],
        explanation:
          "Le dropout est une technique de régularisation qui prévient le surapprentissage en désactivant aléatoirement des neurones pendant l'entraînement.",
      },
      {
        text: "Quelle est la fonction de la couche de pooling dans un CNN ?",
        options: [
          {
            text: "Réduire la dimensionnalité et rendre le réseau plus robuste",
            isCorrect: true,
          },
          {
            text: "Augmenter la taille des feature maps",
            isCorrect: false,
          },
          {
            text: "Ajouter des biais au modèle",
            isCorrect: false,
          },
        ],
        explanation:
          "La couche de pooling réduit la dimensionnalité des feature maps et rend le réseau plus robuste aux petites variations dans l'entrée.",
      },
      {
        text: "Qu'est-ce que la descente de gradient stochastique (SGD) ?",
        options: [
          {
            text: "Un algorithme d'optimisation qui met à jour les poids avec des mini-batches",
            isCorrect: true,
          },
          {
            text: "Une fonction d'activation",
            isCorrect: false,
          },
          {
            text: "Une technique de régularisation",
            isCorrect: false,
          },
        ],
        explanation:
          "SGD est un algorithme d'optimisation qui met à jour les poids du réseau en utilisant des mini-batches de données pour plus d'efficacité.",
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
    title: "ML Engineer - Computer Vision",
    description: "Spécialisation en vision par ordinateur",
    category: "computer_vision",
    estimatedDuration: 12,
    level: "intermediate",
    careerOpportunities: [
      {
        title: "Computer Vision Engineer",
        description: "Développement d'algorithmes de vision par ordinateur",
        averageSalary: "45-75k€/an",
        companies: ["Valeo", "Thales", "Safran"],
      },
    ],
    modules: [
      {
        title: "Introduction à la Vision par Ordinateur",
        description: "Fondamentaux du traitement d'images",
        duration: 20,
        skills: [
          { name: "Python", level: "basic" },
          { name: "OpenCV", level: "basic" },
        ],
        resources: [
          {
            title: "Computer Vision Basics",
            type: "video",
            url: "https://www.coursera.org/learn/computer-vision-basics",
            duration: 120,
          },
        ],
        validationCriteria: [
          "Comprendre les concepts de base du traitement d'images",
          "Implémenter des filtres simples avec OpenCV",
        ],
      },
    ],
  },
  {
    title: "Deep Learning Specialist - GANs",
    description: "Expert en réseaux antagonistes génératifs",
    category: "dl",
    estimatedDuration: 16,
    level: "advanced",
    careerOpportunities: [
      {
        title: "Deep Learning Engineer",
        description: "Conception et optimisation de GANs",
        averageSalary: "60-90k€/an",
        companies: ["OpenAI", "DeepMind", "NVIDIA"],
      },
    ],
    modules: [
      {
        title: "Architectures GAN",
        description: "Fondamentaux des GANs",
        duration: 25,
        skills: [
          { name: "Python", level: "advanced" },
          { name: "PyTorch", level: "advanced" },
        ],
        resources: [
          {
            title: "GAN Specialization",
            type: "video",
            url: "https://www.coursera.org/specializations/generative-adversarial-networks-gans",
            duration: 180,
          },
        ],
        validationCriteria: [
          "Comprendre l'architecture des GANs",
          "Implémenter et entraîner un GAN simple",
        ],
      },
    ],
  },
  {
    title: "NLP Engineer - LLM Specialist",
    description: "Expert en modèles de langage de grande taille",
    category: "nlp",
    estimatedDuration: 14,
    level: "advanced",
    careerOpportunities: [
      {
        title: "NLP Engineer",
        description: "Développement et optimisation de LLMs",
        averageSalary: "65-95k€/an",
        companies: ["Hugging Face", "Anthropic", "Mistral AI"],
      },
    ],
    modules: [
      {
        title: "Fine-tuning de LLMs",
        description: "Techniques d'adaptation de LLMs",
        duration: 30,
        skills: [
          { name: "Python", level: "advanced" },
          { name: "Transformers", level: "advanced" },
        ],
        resources: [
          {
            title: "LLM Fine-tuning Guide",
            type: "article",
            url: "https://huggingface.co/docs/transformers/training",
            duration: 120,
          },
        ],
        validationCriteria: [
          "Comprendre les techniques de fine-tuning",
          "Implémenter un pipeline de fine-tuning efficace",
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
