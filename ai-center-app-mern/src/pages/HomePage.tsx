import React from "react";
import { Link } from "react-router-dom";
import {
  Brain,
  Target,
  ArrowRight,
  Bot,
  Sparkles,
  Code,
  Database,
  BookOpen,
  ChevronRight,
} from "lucide-react";

const CategoryCard = ({
  icon: Icon,
  title,
  description,
  color,
}: {
  icon: typeof Brain;
  title: string;
  description: string;
  color: string;
}) => (
  <div className="glass-card rounded-xl p-6 transform hover:scale-105 transition-all duration-300">
    <div className={`p-2 rounded-lg ${color} w-fit mb-4`}>
      <Icon className="w-6 h-6 text-gray-100" />
    </div>
    <h3 className="text-lg font-bold text-gray-100 mb-2">{title}</h3>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

const ActionCard = ({
  icon: Icon,
  title,
  description,
  to,
  primary = false,
}: {
  icon: typeof Brain;
  title: string;
  description: string;
  to: string;
  primary?: boolean;
}) => (
  <Link
    to={to}
    className="glass-card rounded-xl p-6 flex items-center group hover:scale-105 transition-all duration-300"
  >
    <div className="flex-1">
      <div className="flex items-center space-x-3 mb-2">
        <div
          className={`p-2 rounded-lg ${
            primary ? "bg-purple-500/20" : "bg-blue-500/20"
          }`}
        >
          <Icon
            className={`w-5 h-5 ${
              primary ? "text-purple-400" : "text-blue-400"
            }`}
          />
        </div>
        <h3 className="text-lg font-bold text-gray-100">{title}</h3>
      </div>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
  </Link>
);

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0F] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2074')] bg-cover bg-center opacity-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0A0F]/50 to-[#0A0A0F]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient bg-300">
            Votre Parcours en Intelligence Artificielle
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-12">
            Une formation adaptative et personnalisée pour maîtriser l'IA, de la
            théorie à la pratique
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/assessment"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 flex items-center"
            >
              Commencer l'évaluation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/goals"
              className="px-6 py-3 rounded-xl border border-blue-500 text-blue-400 font-medium hover:bg-blue-500/10 transition-all duration-300"
            >
              Explorer les objectifs
            </Link>
          </div>
        </div>

        {/* Main Actions */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="grid gap-6 md:grid-cols-2">
            <ActionCard
              icon={Brain}
              title="Évaluation Personnalisée"
              description="Découvrez votre niveau actuel et obtenez des recommandations sur mesure"
              to="/assessment"
              primary
            />
            <ActionCard
              icon={Target}
              title="Objectifs d'Apprentissage"
              description="Explorez les parcours disponibles et choisissez votre spécialisation"
              to="/goals"
            />
          </div>
        </div>

        {/* Domains Grid */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold text-center text-gray-100 mb-4">
            Domaines d'Expertise
          </h2>
          <p className="text-center text-gray-400 mb-10">
            Explorez les différentes branches de l'IA et trouvez votre voie
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CategoryCard
              icon={Brain}
              title="Fondamentaux"
              description="Mathématiques, statistiques et programmation essentiels pour l'IA"
              color="bg-blue-500/20"
            />
            <CategoryCard
              icon={Database}
              title="Data Science"
              description="Analyse de données, feature engineering et visualisation"
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
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">
            Prêt à Commencer ?
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Évaluez vos compétences, définissez vos objectifs et commencez votre
            parcours personnalisé dès aujourd'hui
          </p>
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
