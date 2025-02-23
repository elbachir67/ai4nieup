// Types pour les ressources et les parcours
export type ResourceType = "article" | "video" | "course" | "book" | "use_case";
export type ResourceLevel = "basic" | "intermediate" | "advanced";
export type PathwayStatus = "active" | "completed" | "paused";
export type RecommendationType = "resource" | "practice" | "review";
export type RecommendationPriority = "high" | "medium" | "low";
export type RecommendationStatus = "pending" | "completed" | "skipped";

export interface Resource {
  _id: string;
  title: string;
  description: string;
  url: string;
  type: ResourceType;
  level: ResourceLevel;
  duration: string;
  language: "fr" | "en";
  isPremium: boolean;
}

export interface PathwayResource {
  resourceId: string;
  completed: boolean;
  completedAt: Date;
  type?: ResourceType;
}

export interface ModuleQuiz {
  completed: boolean;
  score?: number;
  completedAt?: Date;
}

export interface ModuleProgress {
  moduleIndex: number;
  completed: boolean;
  resources: PathwayResource[];
  quiz: ModuleQuiz;
}

export interface AdaptiveRecommendation {
  type: RecommendationType;
  description: string;
  priority: RecommendationPriority;
  status: RecommendationStatus;
}

export interface Pathway {
  _id: string;
  userId: string;
  goalId: Goal;
  status: PathwayStatus;
  progress: number;
  currentModule: number;
  moduleProgress: ModuleProgress[];
  startedAt: Date;
  lastAccessedAt: Date;
  estimatedCompletionDate: Date;
  adaptiveRecommendations: AdaptiveRecommendation[];
}

export interface Certification {
  available: boolean;
  name: string;
  provider: string;
  url: string;
}

export interface Goal {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  estimatedDuration: number;
  modules: Module[];
  careerOpportunities: CareerOpportunity[];
  certification?: Certification;
  isRecommended?: boolean;
}

export interface Module {
  title: string;
  description: string;
  duration: number;
  resources: Resource[];
  skills?: {
    name: string;
    level: string;
  }[];
  validationCriteria?: string[];
}

export interface CareerOpportunity {
  title: string;
  description: string;
  averageSalary: string;
  companies: string[];
}

export interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

export interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  options?: string[];
  component?: React.ReactNode;
}

export interface AssessmentResult {
  category: string;
  level: string;
  score: number;
  recommendations: string[];
}

export interface UserProfile {
  mathLevel: string;
  programmingLevel: string;
  domain: string;
}

export type GoalCategory =
  | "ml"
  | "dl"
  | "data_science"
  | "mlops"
  | "computer_vision"
  | "nlp";
export type GoalDifficulty = "beginner" | "intermediate" | "advanced";

export interface LearnerDashboard {
  activePathways: Pathway[];
  completedPathways: Pathway[];
  nextMilestones: {
    pathwayId: string;
    goalTitle: string;
    moduleName: string;
    dueDate: Date;
  }[];
  learningStats: {
    totalHoursSpent: number;
    completedResources: number;
    averageQuizScore: number;
    streakDays: number;
  };
}
