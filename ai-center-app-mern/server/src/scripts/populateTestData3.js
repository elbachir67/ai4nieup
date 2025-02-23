import mongoose from "mongoose";
import { Goal } from "../models/LearningGoal.js";
import { Concept } from "../models/Concept.js";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ucad_ia";

// Données supplémentaires pour les objectifs d'apprentissage
const additionalGoals = [
  {
    title: "Computer Vision Expert",
    description: "Maîtrisez le traitement d'images et la vision par ordinateur",
    category: "computer_vision",
    estimatedDuration: 14,
    level: "advanced",
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
      name: "Computer Vision Professional Certificate",
      provider: "UCAD AI Center",
      url: "https://ucad.sn/certifications/cv-pro",
    },
    modules: [
      {
        title: "Fondamentaux du Traitement d'Images",
        description: "Bases du traitement d'images numériques",
        duration: 30,
        skills: [
          { name: "OpenCV", level: "intermediate" },
          { name: "Traitement d'images", level: "intermediate" },
        ],
        resources: [
          {
            title: "Introduction to Computer Vision",
            type: "video",
            url: "https://www.udacity.com/course/introduction-to-computer-vision--ud810",
            duration: 120,
          },
          {
            title: "Hands-On Computer Vision with OpenCV",
            type: "tutorial",
            url: "https://opencv.org/courses/",
            duration: 90,
          },
          {
            title: "Digital Image Processing",
            type: "book",
            url: "https://www.amazon.com/Digital-Image-Processing-Rafael-Gonzalez/dp/0133356728",
            duration: 240,
          },
        ],
        validationCriteria: [
          "Maîtriser les opérations de base sur les images",
          "Implémenter des filtres et des transformations",
        ],
      },
      {
        title: "Deep Learning pour la Vision",
        description: "CNN et architectures avancées",
        duration: 40,
        skills: [
          { name: "PyTorch", level: "advanced" },
          { name: "CNN", level: "advanced" },
        ],
        resources: [
          {
            title: "CS231n: CNN for Visual Recognition",
            type: "tutorial",
            url: "http://cs231n.stanford.edu/",
            duration: 160,
          },
          {
            title: "PyTorch Computer Vision Cookbook",
            type: "book",
            url: "https://www.packtpub.com/product/pytorch-computer-vision-cookbook/9781838644833",
            duration: 180,
          },
          {
            title: "Object Detection with YOLO",
            type: "project",
            url: "https://github.com/ultralytics/yolov5",
            duration: 120,
          },
        ],
        validationCriteria: [
          "Implémenter des architectures CNN modernes",
          "Réaliser des projets de détection d'objets",
        ],
      },
    ],
  },
  {
    title: "NLP Specialist",
    description: "Expertise en traitement du langage naturel",
    category: "nlp",
    estimatedDuration: 16,
    level: "advanced",
    careerOpportunities: [
      {
        title: "NLP Engineer",
        description: "Développement de solutions de traitement du langage",
        averageSalary: "55-85k€/an",
        companies: ["OpenAI", "Anthropic", "Cohere", "Mistral AI"],
      },
      {
        title: "Language AI Researcher",
        description: "R&D en traitement du langage naturel",
        averageSalary: "65-95k€/an",
        companies: ["Google Brain", "DeepMind", "Meta AI"],
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
        title: "Fondamentaux du NLP",
        description: "Bases du traitement du langage naturel",
        duration: 35,
        skills: [
          { name: "NLTK", level: "intermediate" },
          { name: "spaCy", level: "intermediate" },
        ],
        resources: [
          {
            title: "Natural Language Processing Specialization",
            type: "tutorial",
            url: "https://www.coursera.org/specializations/natural-language-processing",
            duration: 140,
          },
          {
            title: "Speech and Language Processing",
            type: "book",
            url: "https://web.stanford.edu/~jurafsky/slp3/",
            duration: 200,
          },
          {
            title: "Sentiment Analysis Project",
            type: "project",
            url: "https://www.kaggle.com/competitions/sentiment-analysis-on-movie-reviews",
            duration: 80,
          },
        ],
        validationCriteria: [
          "Maîtriser le prétraitement du texte",
          "Implémenter des modèles de base en NLP",
        ],
      },
      {
        title: "Transformers et LLMs",
        description: "Architectures avancées pour le NLP",
        duration: 45,
        skills: [
          { name: "Transformers", level: "advanced" },
          { name: "PyTorch", level: "advanced" },
        ],
        resources: [
          {
            title: "Hugging Face Course",
            type: "tutorial",
            url: "https://huggingface.co/course/chapter1/1",
            duration: 180,
          },
          {
            title: "Attention Is All You Need Paper",
            type: "article",
            url: "https://arxiv.org/abs/1706.03762",
            duration: 60,
          },
          {
            title: "Build Your Own LLM",
            type: "project",
            url: "https://github.com/karpathy/nanoGPT",
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
    estimatedDuration: 12,
    level: "intermediate",
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
          {
            title: "Docker for ML Projects",
            type: "project",
            url: "https://github.com/microsoft/MLOps",
            duration: 80,
          },
          {
            title: "ML System Design Interview Guide",
            type: "book",
            url: "https://www.amazon.com/Machine-Learning-System-Design-Interview/dp/1736049119",
            duration: 150,
          },
        ],
        validationCriteria: [
          "Conteneuriser des applications ML",
          "Déployer sur Kubernetes",
        ],
      },
      {
        title: "Monitoring et Maintenance",
        description: "Surveillance et maintenance des modèles",
        duration: 30,
        skills: [
          { name: "MLflow", level: "intermediate" },
          { name: "Prometheus", level: "intermediate" },
        ],
        resources: [
          {
            title: "ML Monitoring Best Practices",
            type: "article",
            url: "https://www.deeplearning.ai/courses/ml-monitoring",
            duration: 120,
          },
          {
            title: "MLflow End-to-End Tutorial",
            type: "tutorial",
            url: "https://mlflow.org/docs/latest/tutorials-and-examples/index.html",
            duration: 90,
          },
          {
            title: "Model Monitoring Dashboard",
            type: "project",
            url: "https://github.com/evidently-ai/evidently",
            duration: 100,
          },
        ],
        validationCriteria: [
          "Mettre en place le monitoring",
          "Gérer le versioning des modèles",
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
    prerequisiteNames: ["Algèbre Linéaire", "Python"],
  },
  {
    name: "Natural Language Processing",
    description: "Introduction au traitement du langage naturel",
    category: "nlp",
    level: "intermediate",
    prerequisiteNames: ["Probabilités", "Python"],
  },
  {
    name: "MLOps Fundamentals",
    description: "Bases du MLOps et du déploiement de modèles",
    category: "mlops",
    level: "intermediate",
    prerequisiteNames: ["Machine Learning", "DevOps"],
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
      logger.info(`Added new concept: ${concept.name}`);

      // Mettre à jour la map avec le nouveau concept
      conceptNameToId.set(concept.name, concept._id);
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
