import { Question } from "../types";

export const DEFAULT_QUESTIONS: Question[] = [
  // Questions de mathématiques
  {
    id: "math_1",
    text: "Quelle est la différence entre une matrice et un vecteur ?",
    category: "math",
    difficulty: "basic",
    options: [
      {
        id: "a",
        text: "Un vecteur est unidimensionnel, une matrice est bidimensionnelle",
        isCorrect: true,
      },
      {
        id: "b",
        text: "Il n'y a aucune différence",
        isCorrect: false,
      },
      {
        id: "c",
        text: "Une matrice ne peut contenir que des nombres",
        isCorrect: false,
      },
    ],
    explanation:
      "Un vecteur est une structure unidimensionnelle (1D) tandis qu'une matrice est bidimensionnelle (2D), organisée en lignes et colonnes.",
  },
  {
    id: "math_2",
    text: "Qu'est-ce que le produit scalaire de deux vecteurs ?",
    category: "math",
    difficulty: "intermediate",
    options: [
      {
        id: "a",
        text: "La somme des produits des composantes correspondantes",
        isCorrect: true,
      },
      {
        id: "b",
        text: "La différence des composantes",
        isCorrect: false,
      },
      {
        id: "c",
        text: "Le produit des longueurs des vecteurs",
        isCorrect: false,
      },
    ],
    explanation:
      "Le produit scalaire est la somme des produits des composantes correspondantes des vecteurs.",
  },
  // Questions Machine Learning
  {
    id: "ml_1",
    text: "Quelle est la différence entre l'apprentissage supervisé et non supervisé ?",
    category: "ml",
    difficulty: "basic",
    options: [
      {
        id: "a",
        text: "L'apprentissage supervisé utilise des données étiquetées, l'apprentissage non supervisé non",
        isCorrect: true,
      },
      {
        id: "b",
        text: "L'apprentissage supervisé est plus rapide",
        isCorrect: false,
      },
      {
        id: "c",
        text: "L'apprentissage non supervisé nécessite plus de données",
        isCorrect: false,
      },
    ],
    explanation:
      "L'apprentissage supervisé utilise des données étiquetées pour entraîner le modèle, tandis que l'apprentissage non supervisé trouve des patterns dans des données non étiquetées.",
  },
  {
    id: "ml_2",
    text: "Qu'est-ce que la validation croisée ?",
    category: "ml",
    difficulty: "intermediate",
    options: [
      {
        id: "a",
        text: "Une technique pour évaluer la performance d'un modèle sur différents sous-ensembles de données",
        isCorrect: true,
      },
      {
        id: "b",
        text: "Une méthode pour nettoyer les données",
        isCorrect: false,
      },
      {
        id: "c",
        text: "Un algorithme d'optimisation",
        isCorrect: false,
      },
    ],
    explanation:
      "La validation croisée divise les données en plusieurs sous-ensembles pour évaluer la performance du modèle de manière plus robuste.",
  },
  // Questions Deep Learning
  {
    id: "dl_1",
    text: "Qu'est-ce qu'une fonction d'activation dans un réseau de neurones ?",
    category: "dl",
    difficulty: "basic",
    options: [
      {
        id: "a",
        text: "Une fonction qui introduit de la non-linéarité dans le réseau",
        isCorrect: true,
      },
      {
        id: "b",
        text: "Une fonction qui initialise les poids",
        isCorrect: false,
      },
      {
        id: "c",
        text: "Une fonction qui détermine la taille du réseau",
        isCorrect: false,
      },
    ],
    explanation:
      "La fonction d'activation introduit de la non-linéarité dans le réseau, permettant d'apprendre des patterns complexes.",
  },
  {
    id: "dl_2",
    text: "Quel est le rôle du dropout dans un réseau de neurones ?",
    category: "dl",
    difficulty: "intermediate",
    options: [
      {
        id: "a",
        text: "Prévenir le surapprentissage en désactivant aléatoirement des neurones",
        isCorrect: true,
      },
      {
        id: "b",
        text: "Accélérer l'apprentissage",
        isCorrect: false,
      },
      {
        id: "c",
        text: "Réduire la taille du modèle",
        isCorrect: false,
      },
    ],
    explanation:
      "Le dropout est une technique de régularisation qui prévient le surapprentissage en désactivant aléatoirement des neurones pendant l'entraînement.",
  },
  // Questions Computer Vision
  {
    id: "cv_1",
    text: "Quel est le rôle principal d'une couche de convolution dans un CNN ?",
    category: "computer_vision",
    difficulty: "basic",
    options: [
      {
        id: "a",
        text: "Extraire des caractéristiques locales de l'image",
        isCorrect: true,
      },
      {
        id: "b",
        text: "Réduire la taille de l'image",
        isCorrect: false,
      },
      {
        id: "c",
        text: "Classifier l'image",
        isCorrect: false,
      },
    ],
    explanation:
      "Les couches de convolution permettent d'extraire des caractéristiques locales comme les bords, les textures et les formes dans l'image.",
  },
  {
    id: "cv_2",
    text: "À quoi sert le pooling dans un CNN ?",
    category: "computer_vision",
    difficulty: "intermediate",
    options: [
      {
        id: "a",
        text: "Réduire la dimensionnalité et rendre le réseau plus robuste",
        isCorrect: true,
      },
      {
        id: "b",
        text: "Augmenter la résolution de l'image",
        isCorrect: false,
      },
      {
        id: "c",
        text: "Ajouter des couleurs à l'image",
        isCorrect: false,
      },
    ],
    explanation:
      "Le pooling réduit la dimensionnalité des feature maps et rend le réseau plus robuste aux petites variations dans l'entrée.",
  },
  // Questions NLP
  {
    id: "nlp_1",
    text: "Qu'est-ce que le word embedding ?",
    category: "nlp",
    difficulty: "basic",
    options: [
      {
        id: "a",
        text: "Une représentation vectorielle des mots",
        isCorrect: true,
      },
      {
        id: "b",
        text: "Une méthode de traduction automatique",
        isCorrect: false,
      },
      {
        id: "c",
        text: "Un algorithme de correction orthographique",
        isCorrect: false,
      },
    ],
    explanation:
      "Le word embedding est une technique qui convertit les mots en vecteurs denses, capturant leurs relations sémantiques.",
  },
  {
    id: "nlp_2",
    text: "Quel est le rôle du mécanisme d'attention dans les transformers ?",
    category: "nlp",
    difficulty: "intermediate",
    options: [
      {
        id: "a",
        text: "Permettre au modèle de se concentrer sur différentes parties de l'entrée",
        isCorrect: true,
      },
      {
        id: "b",
        text: "Accélérer l'entraînement",
        isCorrect: false,
      },
      {
        id: "c",
        text: "Réduire la taille du modèle",
        isCorrect: false,
      },
    ],
    explanation:
      "Le mécanisme d'attention permet au modèle de pondérer dynamiquement l'importance de différentes parties de l'entrée lors du traitement.",
  },
  // Questions MLOps
  {
    id: "mlops_1",
    text: "Quel est l'objectif principal du MLOps ?",
    category: "mlops",
    difficulty: "basic",
    options: [
      {
        id: "a",
        text: "Automatiser et gérer le cycle de vie des modèles ML",
        isCorrect: true,
      },
      {
        id: "b",
        text: "Créer de nouveaux algorithmes ML",
        isCorrect: false,
      },
      {
        id: "c",
        text: "Optimiser les hyperparamètres",
        isCorrect: false,
      },
    ],
    explanation:
      "Le MLOps vise à standardiser et automatiser le déploiement, le monitoring et la maintenance des modèles ML en production.",
  },
  {
    id: "mlops_2",
    text: "Qu'est-ce que le versioning de modèles ?",
    category: "mlops",
    difficulty: "intermediate",
    options: [
      {
        id: "a",
        text: "Suivre et gérer différentes versions des modèles ML",
        isCorrect: true,
      },
      {
        id: "b",
        text: "Une technique d'entraînement",
        isCorrect: false,
      },
      {
        id: "c",
        text: "Un type de modèle ML",
        isCorrect: false,
      },
    ],
    explanation:
      "Le versioning de modèles permet de suivre l'évolution des modèles, facilitant la reproduction des résultats et le rollback si nécessaire.",
  },
];
