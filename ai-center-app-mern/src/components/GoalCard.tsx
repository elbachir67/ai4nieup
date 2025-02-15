import React from 'react';
import { LearningGoal } from '../types';
import { BookOpen, Clock, BarChart } from 'lucide-react';

interface GoalCardProps {
  goal: LearningGoal;
  onClick?: () => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onClick }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500/20 text-green-400';
      case 'intermediate':
        return 'bg-blue-500/20 text-blue-400';
      case 'advanced':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ml':
        return 'Machine Learning';
      case 'dl':
        return 'Deep Learning';
      case 'data_science':
        return 'Data Science';
      case 'mlops':
        return 'MLOps';
      default:
        return category;
    }
  };

  return (
    <div 
      className="glass-card rounded-xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-100">{goal.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(goal.difficulty)}`}>
          {goal.difficulty}
        </span>
      </div>
      
      <p className="text-gray-400 mb-6 line-clamp-2">{goal.description}</p>
      
      <div className="flex items-center space-x-4 text-sm text-gray-400">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          <span>{goal.estimatedDuration}</span>
        </div>
        <div className="flex items-center">
          <BookOpen className="w-4 h-4 mr-1" />
          <span>{goal.requiredConcepts.length} concepts</span>
        </div>
        <div className="flex items-center">
          <BarChart className="w-4 h-4 mr-1" />
          <span>{getCategoryIcon(goal.category)}</span>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;