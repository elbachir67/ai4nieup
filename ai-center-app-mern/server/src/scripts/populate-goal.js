import mongoose from "mongoose";
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

const goals = [
  {
    title: "Machine Learning Fondamental",
    description:
      "Maîtrisez les algorithmes fondamentaux du machine learning et leurs applications pratiques",
    category: "ml",
    level: "beginner",
    estimatedDuration: 12,
    prerequisites: [
      {
        category: "math",
        skills: [
          { name: "Algèbre linéaire", level: "basic" },
          { name: "Statistiques", level: "basic" },
        ],
      },
      {
        category: "programming",
        skills: [
          { name: "Python", level: "basic" },
          { name: "NumPy", level: "basic" },
        ],
      },
    ],
    modules: [
      {
        title: "Régression et Classification",
        description: "Implémentez les algorithmes fondamentaux de ML",
        duration: 30,
        skills: [
          { name: "Régression linéaire", level: "intermediate" },
          { name: "Classification", level: "intermediate" },
        ],
        resources: [
          {
            title: "TP1: Régression linéaire from scratch",
            type: "project",
            url: "https://github.com/ucad-ia/tp-regression",
            duration: 180,
          },
          {
            title: "TP2: Classification avec scikit-learn",
            type: "project",
            url: "https://github.com/ucad-ia/tp-classification",
            duration: 180,
          },
        ],
        validationCriteria: [
          "Implémentation d'une régression linéaire sans bibliothèque",
          "Utilisation correcte de scikit-learn",
          "Évaluation des performances des modèles",
        ],
      },
    ],
  },
  {
    title: "Deep Learning pour la Vision",
    description:
      "Développez des modèles de deep learning pour la vision par ordinateur",
    category: "computer_vision",
    level: "intermediate",
    estimatedDuration: 16,
    prerequisites: [
      {
        category: "math",
        skills: [
          { name: "Calcul matriciel", level: "intermediate" },
          { name: "Optimisation", level: "intermediate" },
        ],
      },
      {
        category: "programming",
        skills: [
          { name: "Python", level: "intermediate" },
          { name: "PyTorch", level: "basic" },
        ],
      },
    ],
    modules: [
      {
        title: "CNN et Transfer Learning",
        description: "Maîtrisez les réseaux de neurones convolutifs",
        duration: 40,
        skills: [
          { name: "CNN", level: "advanced" },
          { name: "Transfer Learning", level: "intermediate" },
        ],
        resources: [
          {
            title: "TP1: Implémentation d'un CNN",
            type: "project",
            url: "https://github.com/ucad-ia/tp-cnn",
            duration: 240,
          },
          {
            title: "TP2: Transfer Learning sur ImageNet",
            type: "project",
            url: "https://github.com/ucad-ia/tp-transfer-learning",
            duration: 180,
          },
        ],
        validationCriteria: [
          "Implémentation d'un CNN from scratch",
          "Fine-tuning d'un modèle pré-entraîné",
          "Déploiement d'un modèle de classification d'images",
        ],
      },
    ],
  },
  {
    title: "NLP Avancé",
    description:
      "Explorez les techniques avancées de traitement du langage naturel",
    category: "nlp",
    level: "advanced",
    estimatedDuration: 20,
    prerequisites: [
      {
        category: "math",
        skills: [
          { name: "Probabilités", level: "advanced" },
          { name: "Algèbre tensorielle", level: "intermediate" },
        ],
      },
      {
        category: "programming",
        skills: [
          { name: "Python", level: "advanced" },
          { name: "PyTorch", level: "intermediate" },
        ],
      },
    ],
    modules: [
      {
        title: "Transformers et BERT",
        description: "Implémentez et fine-tunez des modèles basés sur BERT",
        duration: 45,
        skills: [
          { name: "Transformers", level: "advanced" },
          { name: "Fine-tuning", level: "advanced" },
        ],
        resources: [
          {
            title: "TP1: Implémentation d'un Transformer",
            type: "project",
            url: "https://github.com/ucad-ia/tp-transformer",
            duration: 300,
          },
          {
            title: "TP2: Fine-tuning BERT pour la classification",
            type: "project",
            url: "https://github.com/ucad-ia/tp-bert",
            duration: 240,
          },
        ],
        validationCriteria: [
          "Implémentation d'un Transformer from scratch",
          "Fine-tuning réussi sur un dataset spécifique",
          "Déploiement d'un modèle NLP",
        ],
      },
    ],
  },
  {
    title: "MLOps Pratique",
    description:
      "Apprenez à déployer et maintenir des modèles ML en production",
    category: "mlops",
    level: "intermediate",
    estimatedDuration: 14,
    prerequisites: [
      {
        category: "programming",
        skills: [
          { name: "Python", level: "intermediate" },
          { name: "Docker", level: "basic" },
        ],
      },
      {
        category: "tools",
        skills: [
          { name: "Git", level: "intermediate" },
          { name: "Linux", level: "basic" },
        ],
      },
    ],
    modules: [
      {
        title: "Déploiement de Modèles",
        description: "Déployez des modèles ML avec Docker et FastAPI",
        duration: 35,
        skills: [
          { name: "FastAPI", level: "intermediate" },
          { name: "Docker", level: "intermediate" },
        ],
        resources: [
          {
            title: "TP1: API REST avec FastAPI",
            type: "project",
            url: "https://github.com/ucad-ia/tp-fastapi",
            duration: 180,
          },
          {
            title: "TP2: Conteneurisation avec Docker",
            type: "project",
            url: "https://github.com/ucad-ia/tp-docker",
            duration: 240,
          },
        ],
        validationCriteria: [
          "API REST fonctionnelle",
          "Conteneurisation réussie",
          "Tests d'intégration passants",
        ],
      },
    ],
  },
  {
    title: "Deep Learning pour l'Audio",
    description:
      "Développez des modèles de deep learning pour le traitement audio",
    category: "dl",
    level: "intermediate",
    estimatedDuration: 15,
    prerequisites: [
      {
        category: "math",
        skills: [
          { name: "Traitement du signal", level: "intermediate" },
          { name: "Fourier", level: "intermediate" },
        ],
      },
      {
        category: "programming",
        skills: [
          { name: "Python", level: "intermediate" },
          { name: "PyTorch", level: "intermediate" },
        ],
      },
    ],
    modules: [
      {
        title: "Traitement Audio avec Deep Learning",
        description: "Implémentez des modèles pour l'audio",
        duration: 40,
        skills: [
          { name: "Audio Processing", level: "advanced" },
          { name: "RNN", level: "intermediate" },
        ],
        resources: [
          {
            title: "TP1: Reconnaissance de la Parole",
            type: "project",
            url: "https://github.com/ucad-ia/tp-speech",
            duration: 240,
          },
          {
            title: "TP2: Génération de Musique",
            type: "project",
            url: "https://github.com/ucad-ia/tp-music-gen",
            duration: 180,
          },
        ],
        validationCriteria: [
          "Prétraitement audio réussi",
          "Modèle de reconnaissance fonctionnel",
          "Génération de séquences audio",
        ],
      },
    ],
  },
  {
    title: "IA pour la Robotique",
    description: "Appliquez l'IA à la robotique et au contrôle autonome",
    category: "robotics",
    level: "advanced",
    estimatedDuration: 18,
    prerequisites: [
      {
        category: "math",
        skills: [
          { name: "Contrôle optimal", level: "advanced" },
          { name: "Géométrie 3D", level: "intermediate" },
        ],
      },
      {
        category: "programming",
        skills: [
          { name: "Python", level: "advanced" },
          { name: "ROS", level: "intermediate" },
        ],
      },
    ],
    modules: [
      {
        title: "Apprentissage par Renforcement",
        description: "Implémentez des algorithmes de RL pour la robotique",
        duration: 45,
        skills: [
          { name: "Reinforcement Learning", level: "advanced" },
          { name: "Simulation", level: "intermediate" },
        ],
        resources: [
          {
            title: "TP1: RL avec OpenAI Gym",
            type: "project",
            url: "https://github.com/ucad-ia/tp-rl-gym",
            duration: 240,
          },
          {
            title: "TP2: Contrôle Robotique",
            type: "project",
            url: "https://github.com/ucad-ia/tp-robot-control",
            duration: 300,
          },
        ],
        validationCriteria: [
          "Implémentation d'algorithmes de RL",
          "Simulation robotique réussie",
          "Déploiement sur robot réel",
        ],
      },
    ],
  },
  {
    title: "IA Quantique",
    description:
      "Explorez l'intersection entre l'informatique quantique et l'IA",
    category: "quantum_ml",
    level: "advanced",
    estimatedDuration: 20,
    prerequisites: [
      {
        category: "math",
        skills: [
          { name: "Mécanique quantique", level: "advanced" },
          { name: "Algèbre linéaire", level: "advanced" },
        ],
      },
      {
        category: "programming",
        skills: [
          { name: "Python", level: "advanced" },
          { name: "Qiskit", level: "intermediate" },
        ],
      },
    ],
    modules: [
      {
        title: "Algorithmes Quantiques pour ML",
        description: "Implémentez des algorithmes de ML quantique",
        duration: 50,
        skills: [
          { name: "Quantum Computing", level: "advanced" },
          { name: "Quantum ML", level: "advanced" },
        ],
        resources: [
          {
            title: "TP1: Circuits Quantiques",
            type: "project",
            url: "https://github.com/ucad-ia/tp-quantum-circuits",
            duration: 240,
          },
          {
            title: "TP2: QML avec Pennylane",
            type: "project",
            url: "https://github.com/ucad-ia/tp-qml",
            duration: 300,
          },
        ],
        validationCriteria: [
          "Implémentation de circuits quantiques",
          "Algorithmes QML fonctionnels",
          "Analyse comparative avec ML classique",
        ],
      },
    ],
  },
];

goals.forEach(goal => {
  // Ajout des débouchés selon la catégorie
  switch (goal.category) {
    case "ml":
      goal.careerOpportunities = [
        {
          title: "Machine Learning Engineer",
          description: "Conception et déploiement de modèles ML en production",
          averageSalary: "45-75k€/an",
          companies: ["Orange", "Thales", "Criteo", "Dataiku"],
        },
        {
          title: "Data Scientist",
          description: "Analyse de données et développement de solutions ML",
          averageSalary: "40-65k€/an",
          companies: ["BNP Paribas", "Société Générale", "Ubisoft", "Rakuten"],
        },
      ];
      goal.certification = {
        available: true,
        name: "UCAD ML Professional Certificate",
        provider: "UCAD AI Center",
        url: "https://ucad.sn/certifications/ml-pro",
      };
      break;

    case "computer_vision":
      goal.careerOpportunities = [
        {
          title: "Computer Vision Engineer",
          description: "Développement de solutions de vision par ordinateur",
          averageSalary: "45-70k€/an",
          companies: ["Valeo", "Renault", "Safran", "Yseop"],
        },
        {
          title: "AI Research Engineer",
          description: "R&D en vision par ordinateur et deep learning",
          averageSalary: "50-80k€/an",
          companies: ["INRIA", "CEA", "Huawei", "Samsung"],
        },
      ];
      goal.certification = {
        available: true,
        name: "UCAD Computer Vision Expert",
        provider: "UCAD AI Center",
        url: "https://ucad.sn/certifications/cv-expert",
      };
      break;

    case "nlp":
      goal.careerOpportunities = [
        {
          title: "NLP Engineer",
          description: "Développement de solutions de traitement du langage",
          averageSalary: "45-75k€/an",
          companies: ["Systran", "Qwant", "Sinequa", "LightOn"],
        },
        {
          title: "AI Solutions Architect",
          description: "Conception de solutions NLP pour les entreprises",
          averageSalary: "55-85k€/an",
          companies: ["IBM", "Microsoft", "SAP", "Orange"],
        },
      ];
      goal.certification = {
        available: true,
        name: "UCAD NLP Specialist",
        provider: "UCAD AI Center",
        url: "https://ucad.sn/certifications/nlp-specialist",
      };
      break;

    case "mlops":
      goal.careerOpportunities = [
        {
          title: "MLOps Engineer",
          description: "Déploiement et maintenance de modèles ML en production",
          averageSalary: "50-80k€/an",
          companies: ["OVHcloud", "Datadog", "Contentsquare", "Doctolib"],
        },
        {
          title: "DevOps AI Specialist",
          description: "Automatisation et monitoring de pipelines ML",
          averageSalary: "55-85k€/an",
          companies: ["Google", "Amazon", "Microsoft", "Scale AI"],
        },
      ];
      goal.certification = {
        available: true,
        name: "UCAD MLOps Professional",
        provider: "UCAD AI Center",
        url: "https://ucad.sn/certifications/mlops-pro",
      };
      break;

    case "dl":
      goal.careerOpportunities = [
        {
          title: "Deep Learning Engineer",
          description: "Conception et optimisation de réseaux de neurones",
          averageSalary: "45-75k€/an",
          companies: ["DeepMind", "Meta AI", "Tesla", "NVIDIA"],
        },
        {
          title: "AI Research Scientist",
          description: "R&D en deep learning et architectures avancées",
          averageSalary: "50-90k€/an",
          companies: ["FAIR", "Google Brain", "OpenAI", "DeepMind"],
        },
      ];
      goal.certification = {
        available: true,
        name: "UCAD Deep Learning Expert",
        provider: "UCAD AI Center",
        url: "https://ucad.sn/certifications/dl-expert",
      };
      break;

    case "robotics":
      goal.careerOpportunities = [
        {
          title: "Robotics AI Engineer",
          description: "Développement de solutions IA pour la robotique",
          averageSalary: "45-75k€/an",
          companies: [
            "Boston Dynamics",
            "PAL Robotics",
            "SoftBank Robotics",
            "ABB",
          ],
        },
        {
          title: "Autonomous Systems Engineer",
          description: "Conception de systèmes robotiques autonomes",
          averageSalary: "50-80k€/an",
          companies: ["Airbus", "Thales", "Dassault", "Naval Group"],
        },
      ];
      goal.certification = {
        available: true,
        name: "UCAD Robotics AI Specialist",
        provider: "UCAD AI Center",
        url: "https://ucad.sn/certifications/robotics-ai",
      };
      break;

    case "quantum_ml":
      goal.careerOpportunities = [
        {
          title: "Quantum ML Researcher",
          description: "R&D en apprentissage automatique quantique",
          averageSalary: "60-100k€/an",
          companies: ["IBM Quantum", "Google Quantum", "Atos", "IQM"],
        },
        {
          title: "Quantum Computing Engineer",
          description: "Développement d'algorithmes quantiques pour l'IA",
          averageSalary: "55-95k€/an",
          companies: ["Pasqal", "Quandela", "Xanadu", "D-Wave"],
        },
      ];
      goal.certification = {
        available: true,
        name: "UCAD Quantum ML Pioneer",
        provider: "UCAD AI Center",
        url: "https://ucad.sn/certifications/quantum-ml",
      };
      break;
  }
});

async function populateGoals() {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("Connected to MongoDB");

    // Clear existing goals
    await Goal.deleteMany({});
    logger.info("Cleared existing goals");

    // Insert new goals
    await Goal.insertMany(goals);
    logger.info("Inserted new goals");

    logger.info("Database population completed successfully");
  } catch (error) {
    logger.error("Error populating database:", error);
    throw error;
  } finally {
    await mongoose.disconnect();
    logger.info("Disconnected from MongoDB");
  }
}

populateGoals().catch(error => {
  logger.error("Fatal error during database population:", error);
  process.exit(1);
});
