import mongoose from "mongoose";
import { Goal } from "../models/LearningGoal.js";
import { Concept } from "../models/Concept.js";
import { Quiz } from "../models/Quiz.js";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ucad_ia";

// Les quiz restent inchangés car ils sont corrects
const additionalQuizzes = [
  {
    moduleId: "2",
    title: "Computer Vision Fundamentals",
    description: "Testez vos connaissances en vision par ordinateur",
    timeLimit: 1800,
    passingScore: 70,
    questions: [
      {
        text: "Quelle est la principale utilité des couches de convolution dans un CNN ?",
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
            text: "Classifier l'image directement",
            isCorrect: false,
          },
        ],
        explanation:
          "Les couches de convolution permettent d'extraire des caractéristiques locales comme les contours, les textures et les formes dans l'image.",
      },
      {
        text: "Quel est le rôle du pooling dans un CNN ?",
        options: [
          {
            text: "Réduire la dimensionnalité et augmenter la robustesse",
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
  {
    moduleId: "3",
    title: "Natural Language Processing",
    description: "Évaluez vos connaissances en traitement du langage naturel",
    timeLimit: 2400,
    passingScore: 75,
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
            text: "Accélérer l'entraînement du modèle",
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
];

// Concepts avec leurs prérequis sous forme de noms (seront convertis en IDs)
const additionalConcepts = [
  {
    name: "Vision par Ordinateur",
    description:
      "Fondamentaux de la vision par ordinateur et du traitement d'images",
    category: "computer_vision",
    level: "intermediate",
    prerequisiteNames: ["Algèbre Linéaire", "Calcul Différentiel"],
  },
  {
    name: "Traitement du Langage Naturel",
    description: "Introduction au NLP et aux techniques de traitement du texte",
    category: "nlp",
    level: "intermediate",
    prerequisiteNames: ["Probabilités", "Algèbre Linéaire"],
  },
  {
    name: "MLOps",
    description: "Pratiques DevOps pour le Machine Learning",
    category: "mlops",
    level: "advanced",
    prerequisiteNames: ["Machine Learning", "DevOps"],
  },
];

const additionalGoals = [
  {
    title: "Computer Vision Expert",
    description: "Maîtrisez la vision par ordinateur et le traitement d'images",
    category: "computer_vision",
    level: "advanced",
    estimatedDuration: 16,
    careerOpportunities: [
      {
        title: "Computer Vision Engineer",
        description: "Développement de solutions de vision par ordinateur",
        averageSalary: "50-80k€/an",
        companies: ["Tesla", "NVIDIA", "Intel", "Valeo"],
      },
      {
        title: "AI Research Scientist",
        description: "R&D en vision par ordinateur",
        averageSalary: "60-90k€/an",
        companies: ["DeepMind", "OpenAI", "Meta AI"],
      },
    ],
    certification: {
      available: true,
      name: "Computer Vision Expert Certification",
      provider: "UCAD AI Center",
      url: "https://ucad.sn/certifications/cv-expert",
    },
    modules: [
      {
        title: "Traitement d'Images Avancé",
        description: "Techniques avancées de traitement d'images",
        duration: 30,
        skills: [
          { name: "OpenCV", level: "advanced" },
          { name: "PyTorch", level: "intermediate" },
        ],
        resources: [
          {
            title: "Advanced Computer Vision with Python",
            type: "tutorial", // Changé de 'course' à 'tutorial'
            url: "https://www.coursera.org/learn/advanced-computer-vision-with-python",
            duration: 120,
          },
        ],
        validationCriteria: [
          "Implémenter des algorithmes de traitement d'images avancés",
          "Créer des pipelines de traitement d'images complexes",
        ],
      },
    ],
  },
  {
    title: "NLP Specialist",
    description: "Devenez expert en traitement du langage naturel",
    category: "nlp",
    level: "advanced",
    estimatedDuration: 14,
    careerOpportunities: [
      {
        title: "NLP Engineer",
        description: "Développement de solutions NLP",
        averageSalary: "55-85k€/an",
        companies: ["OpenAI", "Anthropic", "Cohere", "Mistral AI"],
      },
    ],
    certification: {
      available: true,
      name: "Advanced NLP Certification",
      provider: "UCAD AI Center",
      url: "https://ucad.sn/certifications/nlp-advanced",
    },
    modules: [
      {
        title: "Transformers et LLMs",
        description: "Architectures avancées pour le NLP",
        duration: 35,
        skills: [
          { name: "PyTorch", level: "advanced" },
          { name: "Transformers", level: "advanced" },
        ],
        resources: [
          {
            title: "Hugging Face Course",
            type: "tutorial", // Changé de 'course' à 'tutorial'
            url: "https://huggingface.co/course",
            duration: 150,
          },
        ],
        validationCriteria: [
          "Comprendre l'architecture Transformer",
          "Fine-tuner des modèles de langage",
        ],
      },
    ],
  },
];

async function populateAdditionalData() {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("Connected to MongoDB");

    // D'abord, récupérer tous les concepts existants
    const existingConcepts = await Concept.find({});
    const conceptNameToId = new Map(
      existingConcepts.map(concept => [concept.name, concept._id])
    );

    // Ajouter les nouveaux quiz
    for (const quizData of additionalQuizzes) {
      const quiz = new Quiz(quizData);
      await quiz.save();
      logger.info(
        `Created additional quiz: ${quiz.title} for module ${quiz.moduleId}`
      );
    }

    // Ajouter les nouveaux concepts
    for (const conceptData of additionalConcepts) {
      // Convertir les noms des prérequis en ObjectIds
      const prerequisites = (conceptData.prerequisiteNames || [])
        .map(name => conceptNameToId.get(name))
        .filter(id => id); // Filtrer les undefined

      const concept = new Concept({
        name: conceptData.name,
        description: conceptData.description,
        category: conceptData.category,
        level: conceptData.level,
        prerequisites: prerequisites,
      });

      await concept.save();
      logger.info(`Created additional concept: ${concept.name}`);

      // Mettre à jour la map avec le nouveau concept
      conceptNameToId.set(concept.name, concept._id);
    }

    // Ajouter les nouveaux objectifs
    for (const goalData of additionalGoals) {
      const goal = new Goal(goalData);
      await goal.save();
      logger.info(`Created additional goal: ${goal.title}`);
    }

    logger.info("Successfully added additional test data");
  } catch (error) {
    logger.error("Error adding additional test data:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

// Exécuter le script
populateAdditionalData().catch(error => {
  logger.error("Fatal error during data population:", error);
  process.exit(1);
});
