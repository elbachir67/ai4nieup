import { Question } from '../types';

export const QUESTIONS: Question[] = [
  // Questions de mathématiques
  {
    id: 'math_1',
    text: "Quelle est la différence entre une matrice et un vecteur ?",
    category: 'math',
    difficulty: 'basic',
    options: [
      {
        id: 'a',
        text: "Un vecteur est unidimensionnel, une matrice est bidimensionnelle",
        isCorrect: true
      },
      {
        id: 'b',
        text: "Il n'y a aucune différence",
        isCorrect: false
      },
      {
        id: 'c',
        text: "Une matrice ne peut contenir que des nombres",
        isCorrect: false
      }
    ],
    explanation: "Un vecteur est une structure unidimensionnelle (1D) tandis qu'une matrice est bidimensionnelle (2D), organisée en lignes et colonnes."
  },
  // Questions Machine Learning
  {
    id: 'ml_1',
    text: "Quelle est la différence entre l'apprentissage supervisé et non supervisé ?",
    category: 'machine learning',
    difficulty: 'basic',
    options: [
      {
        id: 'a',
        text: "L'apprentissage supervisé utilise des données étiquetées, l'apprentissage non supervisé non",
        isCorrect: true
      },
      {
        id: 'b',
        text: "L'apprentissage supervisé est plus rapide",
        isCorrect: false
      },
      {
        id: 'c',
        text: "L'apprentissage non supervisé nécessite plus de données",
        isCorrect: false
      }
    ],
    explanation: "L'apprentissage supervisé utilise des données étiquetées pour entraîner le modèle, tandis que l'apprentissage non supervisé trouve des patterns dans des données non étiquetées."
  },
  // Questions Deep Learning
  {
    id: 'dl_1',
    text: "Qu'est-ce qu'une fonction d'activation dans un réseau de neurones ?",
    category: 'deep learning',
    difficulty: 'basic',
    options: [
      {
        id: 'a',
        text: "Une fonction qui introduit de la non-linéarité dans le réseau",
        isCorrect: true
      },
      {
        id: 'b',
        text: "Une fonction qui initialise les poids",
        isCorrect: false
      },
      {
        id: 'c',
        text: "Une fonction qui détermine la taille du réseau",
        isCorrect: false
      }
    ],
    explanation: "La fonction d'activation introduit de la non-linéarité dans le réseau, permettant d'apprendre des patterns complexes."
  },
  // Questions Computer Vision
  {
    id: 'cv_1',
    text: "Quel est le rôle principal d'une couche de convolution dans un CNN ?",
    category: 'computer vision',
    difficulty: 'basic',
    options: [
      {
        id: 'a',
        text: "Extraire des caractéristiques locales de l'image",
        isCorrect: true
      },
      {
        id: 'b',
        text: "Réduire la taille de l'image",
        isCorrect: false
      },
      {
        id: 'c',
        text: "Classifier l'image",
        isCorrect: false
      }
    ],
    explanation: "Les couches de convolution permettent d'extraire des caractéristiques locales comme les bords, les textures et les formes dans l'image."
  },
  // Questions NLP
  {
    id: 'nlp_1',
    text: "Qu'est-ce que le word embedding ?",
    category: 'nlp',
    difficulty: 'basic',
    options: [
      {
        id: 'a',
        text: "Une représentation vectorielle des mots",
        isCorrect: true
      },
      {
        id: 'b',
        text: "Une méthode de traduction automatique",
        isCorrect: false
      },
      {
        id: 'c',
        text: "Un algorithme de correction orthographique",
        isCorrect: false
      }
    ],
    explanation: "Le word embedding est une technique qui convertit les mots en vecteurs denses, capturant leurs relations sémantiques."
  },
  // Questions MLOps
  {
    id: 'mlops_1',
    text: "Quel est l'objectif principal du MLOps ?",
    category: 'mlops',
    difficulty: 'basic',
    options: [
      {
        id: 'a',
        text: "Automatiser et gérer le cycle de vie des modèles ML",
        isCorrect: true
      },
      {
        id: 'b',
        text: "Créer de nouveaux algorithmes ML",
        isCorrect: false
      },
      {
        id: 'c',
        text: "Optimiser les hyperparamètres",
        isCorrect: false
      }
    ],
    explanation: "Le MLOps vise à standardiser et automatiser le déploiement, le monitoring et la maintenance des modèles ML en production."
  }
];