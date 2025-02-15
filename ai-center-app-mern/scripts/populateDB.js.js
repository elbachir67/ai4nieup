import mongoose from "mongoose";
import { Section } from "../models/Section.js";
import { Step } from "../models/Step.js";
import { Resource } from "../models/Resource.js";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

const sections = [
  {
    title: "Foundations",
    description: "Bases mathématiques et programmation pour l'IA",
    order: 1,
    icon: "brain",
  },
  {
    title: "Data Science",
    description: "Analyse et traitement des données",
    order: 2,
    icon: "database",
  },
  {
    title: "Machine Learning",
    description: "Algorithmes d'apprentissage automatique",
    order: 3,
    icon: "code",
  },
  {
    title: "Deep Learning",
    description: "Réseaux de neurones et architectures avancées",
    order: 4,
    icon: "bot",
  },
];

const steps = [
  // Foundations Steps
  {
    sectionTitle: "Foundations",
    title: "Mathématiques pour l'IA",
    description: "Fondements mathématiques essentiels pour l'IA",
    duration: "8 semaines",
    details:
      "Algèbre linéaire, calcul différentiel, probabilités et statistiques",
    fullDetails: `Maîtrisez les concepts mathématiques fondamentaux nécessaires pour comprendre et implémenter les algorithmes d'IA :

1. Algèbre Linéaire
- Vecteurs et matrices
- Opérations matricielles
- Valeurs et vecteurs propres
- Décomposition matricielle

2. Calcul Différentiel
- Dérivées et gradients
- Optimisation
- Descente de gradient
- Calcul multivariable

3. Probabilités et Statistiques
- Distributions de probabilité
- Tests statistiques
- Estimation de paramètres
- Intervalles de confiance`,
    prerequisites: ["Mathématiques niveau terminale"],
    learningObjectives: [
      "Comprendre les opérations matricielles",
      "Maîtriser les concepts de calcul différentiel",
      "Appliquer les probabilités aux problèmes d'IA",
    ],
    order: 1,
    difficulty: "intermediate",
  },
  {
    sectionTitle: "Foundations",
    title: "Programmation Python",
    description: "Bases de la programmation Python pour l'IA",
    duration: "6 semaines",
    details: "Python, NumPy, Pandas, visualisation de données",
    fullDetails: `Développez une solide base en programmation Python et ses bibliothèques essentielles :

1. Python Fondamental
- Types de données et structures
- Fonctions et classes
- Gestion des erreurs
- Bonnes pratiques

2. NumPy et Calcul Scientifique
- Arrays et opérations
- Broadcasting
- Fonctions vectorisées
- Manipulation de matrices

3. Pandas et Analyse de Données
- DataFrames et Series
- Nettoyage de données
- Agrégation et groupement
- Fusion de données

4. Visualisation
- Matplotlib
- Seaborn
- Plotly
- Techniques de visualisation avancées`,
    prerequisites: ["Aucun prérequis en programmation"],
    learningObjectives: [
      "Maîtriser la syntaxe Python",
      "Manipuler des données avec NumPy et Pandas",
      "Créer des visualisations efficaces",
    ],
    order: 2,
    difficulty: "beginner",
  },
  // Data Science Steps
  {
    sectionTitle: "Data Science",
    title: "Analyse Exploratoire des Données",
    description: "Techniques avancées d'analyse et visualisation",
    duration: "6 semaines",
    details: "EDA, feature engineering, visualisation",
    fullDetails: `Maîtrisez l'art de l'analyse exploratoire des données :

1. Préparation des Données
- Nettoyage et validation
- Traitement des valeurs manquantes
- Détection d'anomalies
- Normalisation et standardisation

2. Analyse Statistique
- Statistiques descriptives
- Corrélations
- Tests d'hypothèses
- Analyse de distributions

3. Visualisation Avancée
- Graphiques multivariés
- Visualisations interactives
- Storytelling avec les données
- Dashboards`,
    prerequisites: ["Programmation Python", "Statistiques de base"],
    learningObjectives: [
      "Maîtriser les techniques d'EDA",
      "Créer des visualisations pertinentes",
      "Préparer les données pour le ML",
    ],
    order: 1,
    difficulty: "intermediate",
  },
  // Machine Learning Steps
  {
    sectionTitle: "Machine Learning",
    title: "Apprentissage Supervisé",
    description: "Algorithmes fondamentaux du ML",
    duration: "8 semaines",
    details: "Régression, classification, validation",
    fullDetails: `Découvrez les algorithmes fondamentaux du machine learning supervisé :

1. Régression
- Régression linéaire
- Régression polynomiale
- Régularisation
- Évaluation des modèles

2. Classification
- Régression logistique
- SVM
- Arbres de décision
- Random Forests

3. Validation et Optimisation
- Validation croisée
- Sélection de modèles
- Hyperparamètres
- Métriques d'évaluation`,
    prerequisites: ["Mathématiques pour l'IA", "Programmation Python"],
    learningObjectives: [
      "Comprendre les algorithmes de ML",
      "Implémenter des modèles supervisés",
      "Évaluer et optimiser les modèles",
    ],
    order: 1,
    difficulty: "intermediate",
  },
  // Deep Learning Steps
  {
    sectionTitle: "Deep Learning",
    title: "Réseaux de Neurones",
    description: "Fondamentaux du deep learning",
    duration: "8 semaines",
    details: "Architecture, optimisation, régularisation",
    fullDetails: `Maîtrisez les concepts fondamentaux des réseaux de neurones :

1. Architecture
- Neurones et couches
- Fonctions d'activation
- Propagation avant
- Rétropropagation

2. Optimisation
- Descente de gradient stochastique
- Momentum
- Adam et RMSprop
- Learning rate scheduling

3. Régularisation
- Dropout
- Batch normalization
- Data augmentation
- Early stopping`,
    prerequisites: ["Apprentissage Supervisé", "Algèbre linéaire avancée"],
    learningObjectives: [
      "Comprendre l'architecture des réseaux",
      "Maîtriser les techniques d'optimisation",
      "Implémenter des modèles DL",
    ],
    order: 1,
    difficulty: "advanced",
  },
];

const resources = [
  // Math Resources
  {
    stepTitle: "Mathématiques pour l'IA",
    title: "Khan Academy - Algèbre Linéaire",
    description: "Cours complet d'algèbre linéaire avec exercices interactifs",
    url: "https://fr.khanacademy.org/math/linear-algebra",
    type: "course",
    level: "basic",
    duration: "20 heures",
    language: "fr",
    isPremium: false,
  },
  {
    stepTitle: "Mathématiques pour l'IA",
    title: "Mathematics for Machine Learning",
    description:
      "Livre de référence couvrant les bases mathématiques pour l'IA",
    url: "https://mml-book.github.io/",
    type: "book",
    level: "intermediate",
    duration: "40 heures",
    language: "en",
    isPremium: false,
  },
  // Python Resources
  {
    stepTitle: "Programmation Python",
    title: "Python pour les Data Scientists",
    description:
      "Formation complète sur Python et ses bibliothèques pour la data science",
    url: "https://www.python.org/about/gettingstarted/",
    type: "course",
    level: "basic",
    duration: "30 heures",
    language: "fr",
    isPremium: false,
  },
  {
    stepTitle: "Programmation Python",
    title: "Python Data Science Handbook",
    description: "Guide complet sur l'écosystème Python pour la data science",
    url: "https://jakevdp.github.io/PythonDataScienceHandbook/",
    type: "book",
    level: "intermediate",
    duration: "25 heures",
    language: "en",
    isPremium: false,
  },
  // Data Science Resources
  {
    stepTitle: "Analyse Exploratoire des Données",
    title: "Data Visualization with Python",
    description: "Maîtrisez la visualisation de données avec Python",
    url: "https://www.coursera.org/learn/python-for-data-visualization",
    type: "course",
    level: "intermediate",
    duration: "15 heures",
    language: "en",
    isPremium: true,
  },
  // Machine Learning Resources
  {
    stepTitle: "Apprentissage Supervisé",
    title: "Scikit-learn Tutorials",
    description: "Tutoriels officiels de scikit-learn",
    url: "https://scikit-learn.org/stable/tutorial/",
    type: "course",
    level: "intermediate",
    duration: "20 heures",
    language: "en",
    isPremium: false,
  },
  // Deep Learning Resources
  {
    stepTitle: "Réseaux de Neurones",
    title: "Deep Learning Book",
    description: "Le livre de référence sur le deep learning",
    url: "https://www.deeplearningbook.org/",
    type: "book",
    level: "advanced",
    duration: "50 heures",
    language: "en",
    isPremium: false,
  },
];

async function populateDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info("Connected to MongoDB");

    // Clear existing data
    await Promise.all([
      Section.deleteMany({}),
      Step.deleteMany({}),
      Resource.deleteMany({}),
    ]);
    logger.info("Cleared existing data");

    // Insert sections
    const createdSections = await Section.insertMany(sections);
    logger.info("Inserted sections");

    // Create map of section titles to IDs
    const sectionMap = createdSections.reduce((map, section) => {
      map[section.title] = section._id;
      return map;
    }, {});

    // Insert steps with section references
    const stepsWithRefs = steps.map(step => ({
      ...step,
      section: sectionMap[step.sectionTitle],
    }));
    const createdSteps = await Step.insertMany(stepsWithRefs);
    logger.info("Inserted steps");

    // Create map of step titles to IDs
    const stepMap = createdSteps.reduce((map, step) => {
      map[step.title] = step._id;
      return map;
    }, {});

    // Insert resources with step references
    const resourcesWithRefs = resources.map(resource => ({
      ...resource,
      step: stepMap[resource.stepTitle],
    }));
    await Resource.insertMany(resourcesWithRefs);
    logger.info("Inserted resources");

    logger.info("Database population completed successfully");
  } catch (error) {
    logger.error("Error populating database:", error);
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

populateDatabase();
