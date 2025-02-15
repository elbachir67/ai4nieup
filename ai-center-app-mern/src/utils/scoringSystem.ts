import { Question, AssessmentResult, LearningGoal } from '../types';

interface UserResponse {
  questionId: string;
  selectedOption: string;
  timeSpent: number;
}

interface CategoryScore {
  category: string;
  score: number;
  confidence: number;
  timeEfficiency: number;
  weakPoints: string[];
  strongPoints: string[];
}

interface ScoringWeights {
  correctAnswer: number;
  timeEfficiency: number;
  difficultyLevel: number;
  consistencyBonus: number;
}

const WEIGHTS: ScoringWeights = {
  correctAnswer: 0.6,
  timeEfficiency: 0.15,
  difficultyLevel: 0.15,
  consistencyBonus: 0.1
};

const DIFFICULTY_MULTIPLIERS = {
  basic: 1,
  intermediate: 1.5,
  advanced: 2
};

const TIME_THRESHOLDS = {
  basic: 60,
  intermediate: 90,
  advanced: 120
};

// Mapping des catégories aux compétences requises
const CATEGORY_REQUIREMENTS = {
  'math': {
    basic: ['algèbre linéaire', 'calcul différentiel'],
    intermediate: ['probabilités', 'statistiques', 'optimisation'],
    advanced: ['théorie de l\'information', 'analyse complexe']
  },
  'ml': {
    basic: ['régression', 'classification', 'validation croisée'],
    intermediate: ['ensemble methods', 'feature engineering', 'hyperparameter tuning'],
    advanced: ['online learning', 'reinforcement learning']
  },
  'dl': {
    basic: ['réseaux de neurones', 'backpropagation', 'fonctions d\'activation'],
    intermediate: ['CNN', 'RNN', 'transfer learning'],
    advanced: ['architectures avancées', 'optimisation multi-objectifs']
  },
  'computer vision': {
    basic: ['traitement d\'image', 'filtres', 'convolution'],
    intermediate: ['détection d\'objets', 'segmentation', 'tracking'],
    advanced: ['3D vision', 'génération d\'images']
  },
  'nlp': {
    basic: ['tokenization', 'word embeddings', 'text preprocessing'],
    intermediate: ['sequence models', 'attention', 'transformers'],
    advanced: ['LLMs', 'few-shot learning']
  }
};

// Mapping des objectifs aux prérequis
const GOAL_PREREQUISITES = {
  'machine_learning_engineer': {
    math: ['algèbre linéaire', 'probabilités', 'optimisation'],
    programming: ['python', 'scikit-learn', 'pandas'],
    concepts: ['ml_basics', 'model_evaluation', 'feature_engineering']
  },
  'deep_learning_specialist': {
    math: ['calcul différentiel', 'optimisation', 'probabilités'],
    programming: ['pytorch', 'tensorflow', 'python'],
    concepts: ['neural_networks', 'backpropagation', 'architectures']
  },
  'computer_vision_engineer': {
    math: ['algèbre linéaire', 'convolution', 'optimisation'],
    programming: ['opencv', 'pytorch', 'python'],
    concepts: ['image_processing', 'cnn', 'object_detection']
  },
  'nlp_engineer': {
    math: ['probabilités', 'statistiques', 'algèbre linéaire'],
    programming: ['python', 'transformers', 'spacy'],
    concepts: ['linguistics', 'embeddings', 'attention']
  }
};

export function calculateDetailedScore(
  questions: Question[],
  userResponses: UserResponse[]
): CategoryScore[] {
  const categoryScores = new Map<string, CategoryScore>();

  // Initialiser les scores par catégorie
  questions.forEach(question => {
    if (!categoryScores.has(question.category)) {
      categoryScores.set(question.category, {
        category: question.category,
        score: 0,
        confidence: 0,
        timeEfficiency: 0,
        weakPoints: [],
        strongPoints: []
      });
    }
  });

  // Calculer les scores et identifier les points forts/faibles
  userResponses.forEach(response => {
    const question = questions.find(q => q.id === response.questionId);
    if (!question) return;

    const categoryScore = categoryScores.get(question.category)!;
    const scoreDetails = calculateQuestionScore(question, response);
    
    categoryScore.score += scoreDetails.score;
    categoryScore.confidence += scoreDetails.confidence;
    categoryScore.timeEfficiency += scoreDetails.timeEfficiency;

    // Identifier les points forts et faibles
    const requirements = CATEGORY_REQUIREMENTS[question.category]?.[question.difficulty];
    if (requirements) {
      if (scoreDetails.score > 0.7) {
        categoryScore.strongPoints.push(...requirements);
      } else if (scoreDetails.score < 0.4) {
        categoryScore.weakPoints.push(...requirements);
      }
    }
  });

  // Normaliser les scores et dédupliquer les points forts/faibles
  return Array.from(categoryScores.values()).map(score => ({
    ...score,
    score: normalizeScore(score.score),
    confidence: normalizeScore(score.confidence),
    timeEfficiency: normalizeScore(score.timeEfficiency),
    weakPoints: Array.from(new Set(score.weakPoints)),
    strongPoints: Array.from(new Set(score.strongPoints))
  }));
}

function calculateQuestionScore(question: Question, response: UserResponse) {
  const correctOption = question.options.find(opt => opt.isCorrect);
  const isCorrect = correctOption?.id === response.selectedOption;
  const difficultyMultiplier = DIFFICULTY_MULTIPLIERS[question.difficulty];
  const timeThreshold = TIME_THRESHOLDS[question.difficulty];

  const baseScore = isCorrect ? 1 : 0;
  const timeEfficiency = Math.max(0, 1 - (response.timeSpent / timeThreshold));
  const confidence = isCorrect ? calculateConfidence(response.timeSpent, timeThreshold) : 0;

  const score = (
    baseScore * WEIGHTS.correctAnswer * difficultyMultiplier +
    timeEfficiency * WEIGHTS.timeEfficiency +
    confidence * WEIGHTS.consistencyBonus
  );

  return { score, confidence, timeEfficiency };
}

function calculateConfidence(timeSpent: number, timeThreshold: number): number {
  const normalizedTime = Math.min(timeSpent / timeThreshold, 1);
  return 1 - normalizedTime;
}

function normalizeScore(score: number): number {
  return Math.min(Math.max(score * 100, 0), 100);
}

export function generateRecommendations(
  categoryScores: CategoryScore[],
  userProfile: {
    mathLevel: string;
    programmingLevel: string;
    domain: string;
  }
): AssessmentResult[] {
  return categoryScores.map(categoryScore => {
    const { category, score, weakPoints, strongPoints } = categoryScore;
    const level = determineLevel(score);
    
    return {
      category,
      level,
      score,
      recommendations: generateCategoryRecommendations(
        category,
        level,
        score,
        weakPoints,
        strongPoints,
        userProfile
      )
    };
  });
}

function determineLevel(score: number): 'basic' | 'intermediate' | 'advanced' {
  if (score >= 80) return 'advanced';
  if (score >= 50) return 'intermediate';
  return 'basic';
}

function generateCategoryRecommendations(
  category: string,
  level: string,
  score: number,
  weakPoints: string[],
  strongPoints: string[],
  userProfile: {
    mathLevel: string;
    programmingLevel: string;
    domain: string;
  }
): string[] {
  const recommendations: string[] = [];

  // Recommandations basées sur les points faibles
  if (weakPoints.length > 0) {
    recommendations.push(
      `Renforcez vos connaissances en : ${weakPoints.join(', ')}`
    );
  }

  // Recommandations basées sur le profil utilisateur et le domaine choisi
  const domainPrereqs = GOAL_PREREQUISITES[userProfile.domain.toLowerCase()];
  if (domainPrereqs) {
    const missingPrereqs = domainPrereqs[category]?.filter(
      prereq => !strongPoints.includes(prereq)
    );
    
    if (missingPrereqs?.length > 0) {
      recommendations.push(
        `Pour atteindre votre objectif en ${userProfile.domain}, concentrez-vous sur : ${missingPrereqs.join(', ')}`
      );
    }
  }

  // Recommandations spécifiques au niveau
  if (level === 'basic') {
    recommendations.push(
      "Commencez par les concepts fondamentaux avant d'aborder des sujets plus avancés",
      "Pratiquez régulièrement avec des exercices de base"
    );
  } else if (level === 'intermediate') {
    recommendations.push(
      "Approfondissez vos connaissances avec des projets pratiques",
      "Explorez les interconnexions entre les différents concepts"
    );
  } else {
    recommendations.push(
      "Concentrez-vous sur des cas d'usage avancés",
      "Participez à des projets de recherche ou open source"
    );
  }

  // Recommandations spécifiques à la catégorie
  switch (category) {
    case 'math':
      if (score < 70) {
        recommendations.push(
          "Renforcez vos bases mathématiques avec des exercices pratiques",
          "Utilisez des ressources visuelles pour mieux comprendre les concepts"
        );
      }
      break;
    case 'ml':
      if (score < 70) {
        recommendations.push(
          "Commencez par des datasets simples et bien documentés",
          "Implémentez les algorithmes de base avant de passer aux frameworks"
        );
      }
      break;
    case 'dl':
      if (score < 70) {
        recommendations.push(
          "Maîtrisez d'abord les réseaux de neurones simples",
          "Pratiquez avec des frameworks comme PyTorch ou TensorFlow"
        );
      }
      break;
  }

  return recommendations;
}