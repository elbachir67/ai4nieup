import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Target, 
  ArrowRight,
  Bot,
  Sparkles,
  HelpCircle,
  Code,
  Database,
  BookOpen
} from 'lucide-react';

const Logo = () => (
  <div className="flex items-center space-x-2">
    <div className="relative">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg flex items-center justify-center animate-gradient">
        <Brain className="w-6 h-6 text-white" />
      </div>
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full" />
      </div>
    </div>
    <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      IA4Nieup
    </div>
  </div>
);

const CategoryCard = ({ icon: Icon, title, description, color }: { 
  icon: typeof Brain;
  title: string;
  description: string;
  color: string;
}) => (
  <div className="glass-card rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
    <div className="flex items-center space-x-3 mb-3">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-gray-100" />
      </div>
      <h3 className="text-lg font-bold text-gray-100">{title}</h3>
    </div>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0F] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2074')] bg-cover bg-center opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0F]/50 to-[#0A0A0F]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex items-center justify-between pt-6">
          <Logo />
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="px-4 py-2 text-gray-400 hover:text-gray-100 transition-colors"
            >
              Connexion
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mt-16 mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient bg-300">
            Votre Parcours en Intelligence Artificielle
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Une formation adaptative pour maîtriser l'IA
          </p>
        </div>

        {/* Main CTA Cards - Reduced size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
          {/* Pour ceux qui ne savent pas */}
          <div className="glass-card rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <HelpCircle className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-100">Je débute en IA</h2>
            </div>
            <Link
              to="/assessment"
              className="group w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
            >
              Commencer l'évaluation
              <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Pour ceux qui savent */}
          <div className="glass-card rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Target className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-100">Je sais où aller</h2>
            </div>
            <Link
              to="/goals"
              className="group w-full inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-500/10 transition-all duration-300"
            >
              Explorer les objectifs
              <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-100 mb-8 text-center">Parcours Disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CategoryCard
              icon={Brain}
              title="Fondamentaux"
              description="Mathématiques, statistiques et programmation pour l'IA"
              color="bg-blue-500/20"
            />
            <CategoryCard
              icon={Database}
              title="Data Science"
              description="Analyse et visualisation de données, feature engineering"
              color="bg-green-500/20"
            />
            <CategoryCard
              icon={Code}
              title="Machine Learning"
              description="Algorithmes classiques et apprentissage statistique"
              color="bg-purple-500/20"
            />
            <CategoryCard
              icon={Bot}
              title="Deep Learning"
              description="Réseaux de neurones et architectures avancées"
              color="bg-pink-500/20"
            />
            <CategoryCard
              icon={BookOpen}
              title="NLP"
              description="Traitement du langage naturel et LLMs"
              color="bg-amber-500/20"
            />
            <CategoryCard
              icon={Sparkles}
              title="Computer Vision"
              description="Vision par ordinateur et traitement d'images"
              color="bg-cyan-500/20"
            />
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pb-16">
          <Link
            to="/assessment"
            className="inline-flex items-center px-8 py-3 text-lg font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
          >
            Démarrer mon parcours
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;