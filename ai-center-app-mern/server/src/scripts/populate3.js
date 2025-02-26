import mongoose from "mongoose";
import { Quiz } from "../models/Quiz.js";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ucad_ia";

const quizData = [
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
        text: "Quel est le rôle de la régularisation dans le machine learning ?",
        options: [
          {
            text: "Prévenir le surapprentissage en pénalisant la complexité du modèle",
            isCorrect: true,
          },
          {
            text: "Accélérer l'entraînement du modèle",
            isCorrect: false,
          },
          {
            text: "Augmenter la précision du modèle sur les données d'entraînement",
            isCorrect: false,
          },
        ],
        explanation:
          "La régularisation aide à prévenir le surapprentissage en ajoutant un terme de pénalité qui limite la complexité du modèle.",
      },
      {
        text: "Quelle métrique est la plus appropriée pour un problème de classification déséquilibrée ?",
        options: [
          {
            text: "La courbe ROC et l'aire sous la courbe (AUC)",
            isCorrect: true,
          },
          {
            text: "La précision globale",
            isCorrect: false,
          },
          {
            text: "L'erreur quadratique moyenne",
            isCorrect: false,
          },
        ],
        explanation:
          "La courbe ROC et l'AUC sont particulièrement utiles pour les classifications déséquilibrées car elles sont insensibles à la distribution des classes.",
      },
      {
        text: "Qu'est-ce que le gradient descent ?",
        options: [
          {
            text: "Un algorithme d'optimisation qui minimise une fonction de coût",
            isCorrect: true,
          },
          {
            text: "Une technique de prétraitement des données",
            isCorrect: false,
          },
          {
            text: "Un type de réseau de neurones",
            isCorrect: false,
          },
        ],
        explanation:
          "Le gradient descent est un algorithme d'optimisation qui ajuste itérativement les paramètres du modèle pour minimiser l'erreur.",
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
        text: "Quelle est la différence entre un CNN et un RNN ?",
        options: [
          {
            text: "Les CNN sont spécialisés pour les images, les RNN pour les séquences",
            isCorrect: true,
          },
          {
            text: "Les CNN sont plus rapides à entraîner",
            isCorrect: false,
          },
          {
            text: "Les RNN utilisent moins de mémoire",
            isCorrect: false,
          },
        ],
        explanation:
          "Les CNN sont optimisés pour traiter des données spatiales comme les images, tandis que les RNN sont conçus pour traiter des séquences temporelles.",
      },
      {
        text: "Qu'est-ce que le vanishing gradient problem ?",
        options: [
          {
            text: "Les gradients deviennent trop petits dans les couches profondes",
            isCorrect: true,
          },
          {
            text: "Le modèle apprend trop rapidement",
            isCorrect: false,
          },
          {
            text: "La mémoire GPU est insuffisante",
            isCorrect: false,
          },
        ],
        explanation:
          "Le vanishing gradient problem survient quand les gradients deviennent si petits dans les couches profondes que l'apprentissage devient inefficace.",
      },
      {
        text: "Quel est l'avantage principal des connexions résiduelles (skip connections) ?",
        options: [
          {
            text: "Permettre l'entraînement de réseaux très profonds",
            isCorrect: true,
          },
          {
            text: "Réduire le nombre de paramètres",
            isCorrect: false,
          },
          {
            text: "Accélérer l'inférence",
            isCorrect: false,
          },
        ],
        explanation:
          "Les connexions résiduelles permettent aux gradients de circuler plus facilement à travers le réseau, facilitant l'entraînement de réseaux très profonds.",
      },
    ],
  },
  {
    moduleId: "2",
    title: "Computer Vision Avancée",
    description: "Testez vos connaissances en vision par ordinateur",
    timeLimit: 1800,
    passingScore: 70,
    questions: [
      {
        text: "Quelle est la principale différence entre YOLO et R-CNN pour la détection d'objets ?",
        options: [
          {
            text: "YOLO fait la détection en une seule passe, R-CNN utilise une approche en deux étapes",
            isCorrect: true,
          },
          {
            text: "YOLO est plus précis que R-CNN",
            isCorrect: false,
          },
          {
            text: "R-CNN est plus rapide que YOLO",
            isCorrect: false,
          },
        ],
        explanation:
          "YOLO (You Only Look Once) traite l'image en une seule passe pour la détection, tandis que R-CNN utilise une approche en deux étapes avec proposition de régions puis classification.",
      },
      {
        text: "Qu'est-ce que le Feature Pyramid Network (FPN) ?",
        options: [
          {
            text: "Une architecture qui combine des features à différentes échelles",
            isCorrect: true,
          },
          {
            text: "Un type de fonction d'activation",
            isCorrect: false,
          },
          {
            text: "Une technique de data augmentation",
            isCorrect: false,
          },
        ],
        explanation:
          "FPN est une architecture qui combine des features à différentes échelles pour améliorer la détection d'objets de différentes tailles.",
      },
    ],
  },
];

async function populateQuizData() {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("Connected to MongoDB");

    // Nettoyer les données existantes
    await Quiz.deleteMany({});
    logger.info("Cleared existing quiz data");

    // Insérer les nouveaux quiz
    const createdQuizzes = await Quiz.insertMany(quizData);
    logger.info(`Created ${createdQuizzes.length} quizzes`);

    logger.info("Quiz data population completed successfully");
  } catch (error) {
    logger.error("Error populating quiz data:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

// Exécuter le script
populateQuizData().catch(error => {
  logger.error("Fatal error during quiz data population:", error);
  process.exit(1);
});
