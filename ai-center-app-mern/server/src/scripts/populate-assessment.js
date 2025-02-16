import mongoose from "mongoose";
import { Assessment } from "../models/Assessment.js";
import { Goal } from "../models/LearningGoal.js";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ucad_ia";

const assessments = [
  // Mathématiques
  {
    title: "Évaluation Mathématiques Fondamentales",
    category: "math",
    difficulty: "basic",
    questions: [
      {
        text: "Quelle est la différence entre une matrice et un vecteur ?",
        options: [
          {
            text: "Un vecteur est unidimensionnel, une matrice est bidimensionnelle",
            isCorrect: true,
          },
          {
            text: "Il n'y a aucune différence",
            isCorrect: false,
          },
          {
            text: "Une matrice ne peut contenir que des nombres",
            isCorrect: false,
          },
        ],
        explanation:
          "Un vecteur est une structure unidimensionnelle (1D) tandis qu'une matrice est bidimensionnelle (2D), organisée en lignes et colonnes.",
      },
      {
        text: "Qu'est-ce que le produit scalaire de deux vecteurs ?",
        options: [
          {
            text: "La somme des produits des composantes correspondantes",
            isCorrect: true,
          },
          {
            text: "La différence des composantes",
            isCorrect: false,
          },
          {
            text: "Le produit des longueurs des vecteurs",
            isCorrect: false,
          },
        ],
        explanation:
          "Le produit scalaire est la somme des produits des composantes correspondantes des vecteurs, donnant un nombre scalaire.",
      },
      {
        text: "Quelle est la dérivée de la fonction f(x) = x² ?",
        options: [
          {
            text: "f'(x) = 2x",
            isCorrect: true,
          },
          {
            text: "f'(x) = x",
            isCorrect: false,
          },
          {
            text: "f'(x) = 2",
            isCorrect: false,
          },
        ],
        explanation:
          "La dérivée de x² est 2x selon la règle de dérivation des puissances : d/dx(x^n) = nx^(n-1).",
      },
    ],
  },
  {
    title: "Évaluation Mathématiques Avancées",
    category: "math",
    difficulty: "advanced",
    questions: [
      {
        text: "Quelle est la signification géométrique du déterminant d'une matrice 2x2 ?",
        options: [
          {
            text: "L'aire du parallélogramme formé par les vecteurs colonnes",
            isCorrect: true,
          },
          {
            text: "La somme des éléments diagonaux",
            isCorrect: false,
          },
          {
            text: "Le périmètre du rectangle formé",
            isCorrect: false,
          },
        ],
        explanation:
          "Le déterminant d'une matrice 2x2 représente l'aire du parallélogramme formé par les vecteurs colonnes de la matrice.",
      },
    ],
  },
  // Machine Learning
  {
    title: "Évaluation Machine Learning Fondamental",
    category: "ml",
    difficulty: "basic",
    questions: [
      {
        text: "Quelle est la différence entre l'apprentissage supervisé et non supervisé ?",
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
  // Deep Learning
  {
    title: "Évaluation Deep Learning Fondamental",
    category: "dl",
    difficulty: "basic",
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
    ],
  },
  // Computer Vision
  {
    title: "Évaluation Computer Vision",
    category: "computer_vision",
    difficulty: "basic",
    questions: [
      {
        text: "Quel est le rôle principal d'une couche de convolution dans un CNN ?",
        options: [
          {
            text: "Extraire des caractéristiques locales de l'image",
            isCorrect: true,
          },
          {
            text: "Réduire la taille de l'image",
            isCorrect: false,
          },
          {
            text: "Classifier l'image",
            isCorrect: false,
          },
        ],
        explanation:
          "Les couches de convolution permettent d'extraire des caractéristiques locales comme les bords, les textures et les formes dans l'image.",
      },
      {
        text: "À quoi sert le pooling dans un CNN ?",
        options: [
          {
            text: "Réduire la dimensionnalité et rendre le réseau plus robuste",
            isCorrect: true,
          },
          {
            text: "Augmenter la résolution de l'image",
            isCorrect: false,
          },
          {
            text: "Ajouter des couleurs à l'image",
            isCorrect: false,
          },
        ],
        explanation:
          "Le pooling réduit la dimensionnalité des feature maps et rend le réseau plus robuste aux petites variations dans l'entrée.",
      },
    ],
  },
  // NLP
  {
    title: "Évaluation NLP",
    category: "nlp",
    difficulty: "basic",
    questions: [
      {
        text: "Qu'est-ce que le word embedding ?",
        options: [
          {
            text: "Une représentation vectorielle des mots",
            isCorrect: true,
          },
          {
            text: "Une méthode de traduction automatique",
            isCorrect: false,
          },
          {
            text: "Un algorithme de correction orthographique",
            isCorrect: false,
          },
        ],
        explanation:
          "Le word embedding est une technique qui convertit les mots en vecteurs denses, capturant leurs relations sémantiques.",
      },
      {
        text: "Quel est le rôle du mécanisme d'attention dans les transformers ?",
        options: [
          {
            text: "Permettre au modèle de se concentrer sur différentes parties de l'entrée",
            isCorrect: true,
          },
          {
            text: "Accélérer l'entraînement",
            isCorrect: false,
          },
          {
            text: "Réduire la taille du modèle",
            isCorrect: false,
          },
        ],
        explanation:
          "Le mécanisme d'attention permet au modèle de pondérer dynamiquement l'importance de différentes parties de l'entrée lors du traitement.",
      },
    ],
  },
  // MLOps
  {
    title: "Évaluation MLOps",
    category: "mlops",
    difficulty: "basic",
    questions: [
      {
        text: "Quel est l'objectif principal du MLOps ?",
        options: [
          {
            text: "Automatiser et gérer le cycle de vie des modèles ML",
            isCorrect: true,
          },
          {
            text: "Créer de nouveaux algorithmes ML",
            isCorrect: false,
          },
          {
            text: "Optimiser les hyperparamètres",
            isCorrect: false,
          },
        ],
        explanation:
          "Le MLOps vise à standardiser et automatiser le déploiement, le monitoring et la maintenance des modèles ML en production.",
      },
      {
        text: "Qu'est-ce que le versioning de modèles ?",
        options: [
          {
            text: "Suivre et gérer différentes versions des modèles ML",
            isCorrect: true,
          },
          {
            text: "Une technique d'entraînement",
            isCorrect: false,
          },
          {
            text: "Un type de modèle ML",
            isCorrect: false,
          },
        ],
        explanation:
          "Le versioning de modèles permet de suivre l'évolution des modèles, facilitant la reproduction des résultats et le rollback si nécessaire.",
      },
    ],
  },
];

async function populateAssessments() {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("Connected to MongoDB");

    // Clear existing assessments
    await Assessment.deleteMany({});
    logger.info("Cleared existing assessments");

    // Get goals to link with assessments
    const goals = await Goal.find({});

    // Add recommended goals to assessments
    const assessmentsWithGoals = assessments.map(assessment => ({
      ...assessment,
      recommendedGoals: goals
        .filter(
          goal =>
            goal.category === assessment.category &&
            goal.difficulty === assessment.difficulty
        )
        .map(goal => goal._id),
    }));

    // Insert assessments
    await Assessment.insertMany(assessmentsWithGoals);
    logger.info("Inserted new assessments");

    logger.info("Database population completed successfully");
  } catch (error) {
    logger.error("Error populating database:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

populateAssessments().catch(error => {
  logger.error("Fatal error during database population:", error);
  process.exit(1);
});
