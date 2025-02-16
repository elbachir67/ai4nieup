import { DivideIcon as LucideIcon } from "lucide-react";

export interface Goal {
  id: string;
  title: string;
  description: string;
  category: "ml" | "dl" | "data_science" | "mlops" | "computer_vision" | "nlp";
  estimatedDuration: number;
  level: "beginner" | "intermediate" | "advanced";
  prerequisites: {
    category: string;
    skills: {
      name: string;
      level: string;
    }[];
  }[];
  modules: {
    title: string;
    description: string;
    duration: number;
    skills: {
      name: string;
      level: string;
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
