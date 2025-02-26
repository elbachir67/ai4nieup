import mongoose from "mongoose";
import { Goal } from "../models/LearningGoal.js";
import { Concept } from "../models/Concept.js";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ucad_ia";

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
            type: "tutorial",
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
            type: "tutorial",
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
  {
    title: "MLOps Engineer",
    description: "Expert en déploiement et maintenance de modèles ML",
    category: "mlops",
    level: "intermediate",
    estimatedDuration: 12,
    careerOpportunities: [
      {
        title: "MLOps Engineer",
        description: "Gestion du cycle de vie des modèles ML",
        averageSalary: "45-75k€/an",
        companies: ["AWS", "Google Cloud", "Azure", "DataRobot"],
      },
      {
        title: "ML Platform Engineer",
        description: "Développement d'infrastructures ML",
        averageSalary: "50-80k€/an",
        companies: ["Databricks", "Dataiku", "H2O.ai"],
      },
    ],
    certification: {
      available: true,
      name: "MLOps Professional Certificate",
      provider: "UCAD AI Center",
      url: "https://ucad.sn/certifications/mlops-pro",
    },
    modules: [
      {
        title: "Infrastructure ML",
        description: "Mise en place d'infrastructures ML",
        duration: 25,
        skills: [
          { name: "Docker", level: "intermediate" },
          { name: "Kubernetes", level: "intermediate" },
        ],
        resources: [
          {
            title: "MLOps Fundamentals",
            type: "tutorial",
            url: "https://www.coursera.org/learn/mlops-fundamentals",
            duration: 100,
          },
        ],
        validationCriteria: [
          "Conteneuriser des applications ML",
          "Déployer sur Kubernetes",
        ],
      },
    ],
  },
  {
    title: "Data Science Expert",
    description: "Maîtrisez l'analyse et la science des données",
    category: "data_science",
    level: "advanced",
    estimatedDuration: 14,
    careerOpportunities: [
      {
        title: "Data Scientist",
        description: "Analyse et modélisation de données",
        averageSalary: "45-70k€/an",
        companies: ["Orange", "Criteo", "BNP Paribas", "Ubisoft"],
      },
    ],
    certification: {
      available: true,
      name: "Data Science Expert Certification",
      provider: "UCAD AI Center",
      url: "https://ucad.sn/certifications/data-science-expert",
    },
    modules: [
      {
        title: "Analyse Avancée",
        description: "Techniques avancées d'analyse de données",
        duration: 30,
        skills: [
          { name: "Python", level: "advanced" },
          { name: "SQL", level: "advanced" },
        ],
        resources: [
          {
            title: "Advanced Data Analysis",
            type: "tutorial",
            url: "https://www.coursera.org/learn/advanced-data-analysis",
            duration: 120,
          },
        ],
        validationCriteria: [
          "Maîtriser les techniques d'analyse avancées",
          "Créer des pipelines de données complexes",
        ],
      },
    ],
  },
];

// Concepts supplémentaires
const additionalConcepts = [
  {
    name: "Computer Vision Basics",
    description: "Fondamentaux de la vision par ordinateur",
    category: "computer_vision",
    level: "basic",
  },
  {
    name: "Natural Language Processing",
    description: "Introduction au traitement du langage naturel",
    category: "nlp",
    level: "intermediate",
  },
  {
    name: "MLOps Fundamentals",
    description: "Bases du MLOps et du déploiement de modèles",
    category: "mlops",
    level: "intermediate",
  },
];

async function populateAdditionalData() {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("Connected to MongoDB");

    // Ajouter les nouveaux concepts
    for (const conceptData of additionalConcepts) {
      const concept = new Concept(conceptData);
      await concept.save();
      logger.info(`Added new concept: ${concept.name}`);
    }

    // Ajouter les nouveaux objectifs
    for (const goalData of additionalGoals) {
      const goal = new Goal(goalData);
      await goal.save();
      logger.info(`Added new goal: ${goal.title}`);
    }

    logger.info("Successfully added additional data");
  } catch (error) {
    logger.error("Error adding additional data:", error);
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
