import { DivideIcon as LucideIcon } from "lucide-react";

export type GoalCategory =
  | "ml"
  | "dl"
  | "data_science"
  | "mlops"
  | "computer_vision"
  | "nlp";
export type GoalDifficulty = "beginner" | "intermediate" | "advanced";

export interface Goal {
  _id: string; // Changé de 'id' à '_id' pour correspondre au format MongoDB
  title: string;
  description: string;
  category: GoalCategory;
  estimatedDuration: number;
  level: GoalDifficulty;
  prerequisites: {
    category: string;
    skills: {
      name: string;
      level: GoalDifficulty;
    }[];
  }[];
  modules: {
    title: string;
    description: string;
    duration: number;
    skills: {
      name: string;
      level: GoalDifficulty;
    }[];
    resources: {
      title: string;
      type: string;
      url: string;
      duration: number;
    }[];
    validationCriteria: string[];
  }[];
  careerOpportunities: {
    title: string;
    description: string;
    averageSalary: string;
    companies: string[];
  }[];
  certification?: {
    available: boolean;
    name: string;
    provider: string;
    url: string;
  };
  isRecommended?: boolean;
  matchScore?: number;
  userProgress?: {
    started: boolean;
    completed: boolean;
    progress: number;
    lastAccessedAt?: string;
  };
}

export interface Message {
  id: string;
  content: string;
  type: "bot" | "user";
  options?: string[];
  component?: React.ReactNode;
}

export interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: "basic" | "intermediate" | "advanced";
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

export interface AssessmentResult {
  category: string;
  level: "basic" | "intermediate" | "advanced";
  score: number;
  recommendations: string[];
}

export interface UserProfile {
  id: string;
  userId: string;
  learningStyle: "visual" | "auditory" | "reading" | "kinesthetic";
  preferences: {
    mathLevel: GoalDifficulty;
    programmingLevel: GoalDifficulty;
    preferredDomain: GoalCategory;
  };
  assessments: {
    category: string;
    score: number;
    completedAt: string;
  }[];
}
