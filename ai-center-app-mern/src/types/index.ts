// Types pour les ressources
export type ResourceType = "article" | "video" | "course" | "book" | "use_case";

// Types pour les niveaux de difficulté
export type GoalDifficulty = "beginner" | "intermediate" | "advanced";

// Types pour les catégories de buts
export type GoalCategory =
  | "ml"
  | "dl"
  | "data_science"
  | "mlops"
  | "computer_vision"
  | "nlp"
  | "robotics"
  | "quantum_ml";

// Interface pour les compétences
export interface Skill {
  name: string;
  level: string;
}

// Interface pour les ressources
export interface Resource {
  title: string;
  type: ResourceType;
  url: string;
  duration: number;
}

// Interface pour les opportunités de carrière
export interface CareerOpportunity {
  title: string;
  description: string;
  averageSalary: string;
  companies: string[];
}

// Interface pour la certification
export interface Certification {
  available: boolean;
  name: string;
  provider: string;
  url: string;
}

// Interface pour les modules
export interface Module {
  title: string;
  description: string;
  duration: number;
  skills: Skill[];
  resources: Resource[];
  validationCriteria: string[];
}

// Interface pour les buts
export interface Goal {
  _id: string;
  title: string;
  description: string;
  category: GoalCategory;
  level: GoalDifficulty;
  estimatedDuration: number;
  modules: Module[];
  careerOpportunities: CareerOpportunity[];
  certification?: Certification;
  isRecommended?: boolean;
}

// Types pour les quiz
export interface QuizQuestion {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  answers: {
    questionId: string;
    selectedOption: string;
    isCorrect: boolean;
    timeSpent: number;
  }[];
}

export interface ModuleQuiz {
  id: string;
  title: string;
  description: string;
  timeLimit: number;
  questions: QuizQuestion[];
  passingScore: number;
}

// Interface pour le progrès des modules
export interface PathwayResource {
  resourceId: string;
  completed: boolean;
  completedAt?: Date;
}

export interface ModuleProgress {
  moduleIndex: number;
  completed: boolean;
  resources: PathwayResource[];
  quiz: {
    completed: boolean;
    score?: number;
    completedAt?: Date;
  };
}

// Interface pour le tableau de bord de l'apprenant
export interface LearningStats {
  totalHoursSpent: number;
  completedResources: number;
  averageQuizScore: number;
  streakDays: number;
}

export interface Milestone {
  goalTitle: string;
  moduleName: string;
  dueDate: Date;
}

export interface LearnerDashboard {
  learningStats: LearningStats;
  activePathways: Pathway[];
  completedPathways: Pathway[];
  nextMilestones: Milestone[];
}

// Interface pour le parcours d'apprentissage
export interface Pathway {
  _id: string;
  userId: string;
  goalId: Goal;
  status: "active" | "completed" | "paused";
  progress: number;
  currentModule: number;
  moduleProgress: ModuleProgress[];
  startedAt: Date;
  lastAccessedAt: Date;
  estimatedCompletionDate: Date;
  adaptiveRecommendations: {
    type: "resource" | "practice" | "review";
    description: string;
    priority: "high" | "medium" | "low";
    status: "pending" | "completed" | "skipped";
  }[];
}

// Interface pour le profil utilisateur
export interface UserProfile {
  mathLevel: string;
  programmingLevel: string;
  domain: string;
}

// Interface pour les résultats d'évaluation
export interface AssessmentResult {
  category: string;
  level: string;
  score: number;
  recommendations: string[];
}
