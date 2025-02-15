import { DivideIcon as LucideIcon } from 'lucide-react';

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  category: 'ml' | 'dl' | 'data_science' | 'mlops';
  requiredConcepts: string[];
  estimatedDuration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Concept {
  id: string;
  name: string;
  description: string;
  category: string;
  level: 'basic' | 'intermediate' | 'advanced';
  prerequisites: string[];
  resources: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'course' | 'book';
  url: string;
  duration: string;
}

export interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
}

export interface AssessmentResult {
  category: string;
  level: 'basic' | 'intermediate' | 'advanced';
  score: number;
  recommendations: string[];
}

export interface Message {
  id: string;
  content: string;
  type: 'bot' | 'user';
  options?: string[];
  component?: React.ReactNode;
}