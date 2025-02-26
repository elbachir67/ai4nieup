import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../config/api";
import { QuizQuestion, Question } from "../types";
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  calculateDetailedScore,
  generateRecommendations,
} from "../utils/scoringSystem";

function QuizPage() {
  const { pathwayId, moduleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [answers, setAnswers] = useState<
    {
      questionId: string;
      selectedOption: string;
      isCorrect: boolean;
      timeSpent: number;
    }[]
  >([]);
  const [quizStartTime] = useState(Date.now());

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!pathwayId || !moduleId || !user) return;

      try {
        const response = await fetch(
          `${api.pathways}/${pathwayId}/modules/${moduleId}/quiz`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Erreur lors du chargement du quiz");
        }

        const data = await response.json();
        setQuestions(data.questions);
        setTimeLeft(data.timeLimit);
        setStartTime(Date.now());
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Erreur lors du chargement du quiz");
        navigate(`/pathways/${pathwayId}`);
      }
    };

    fetchQuiz();
  }, [pathwayId, moduleId, user, navigate]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleQuizComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerSelect = (optionId: string) => {
    if (showExplanation) return;

    const timeSpent = (Date.now() - startTime) / 1000;
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.options.find(
      opt => opt.id === optionId
    )?.isCorrect;

    setSelectedAnswer(optionId);
    setShowExplanation(true);
    setAnswers(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        selectedOption: optionId,
        isCorrect: isCorrect || false,
        timeSpent,
      },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      handleQuizComplete();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setStartTime(Date.now());
    }
  };

  const handleQuizComplete = async () => {
    if (!pathwayId || !moduleId || !user) return;

    // Calculer le score détaillé
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const score = Math.round((correctAnswers / questions.length) * 100);
    const totalTimeSpent = Math.round((Date.now() - quizStartTime) / 1000);

    // Calculer les statistiques détaillées
    const categoryScores = calculateDetailedScore(questions, answers);
    const recommendations = generateRecommendations(categoryScores, {
      mathLevel: "intermediate",
      programmingLevel: "intermediate",
      domain: "ml",
    });

    try {
      const response = await fetch(
        `${api.pathways}/${pathwayId}/modules/${moduleId}/quiz/submit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            score,
            answers,
            totalTimeSpent,
            categoryScores,
            recommendations,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la soumission du quiz");
      }

      toast.success("Quiz complété avec succès !");
      navigate(`/pathways/${pathwayId}/quiz-results`, {
        state: {
          result: {
            score,
            totalQuestions: questions.length,
            correctAnswers,
            timeSpent: totalTimeSpent,
            answers,
            categoryScores,
            recommendations,
          },
        },
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erreur lors de la soumission du quiz");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-gray-400">Chargement du quiz...</div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#0A0A0F] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-xl p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-100">
                Question {currentQuestionIndex + 1} sur {questions.length}
              </h1>
              <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="flex items-center text-gray-400">
              <Clock className="w-5 h-5 mr-2" />
              <span>
                {Math.floor(timeLeft / 60)}:
                {String(timeLeft % 60).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <p className="text-xl text-gray-200">{currentQuestion.text}</p>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {currentQuestion.options.map(option => {
              const isSelected = selectedAnswer === option.id;
              let optionStyle = "border-gray-700 hover:border-purple-500/50";
              let iconComponent = null;

              if (showExplanation) {
                if (option.isCorrect) {
                  optionStyle = "border-green-500 bg-green-500/10";
                  iconComponent = (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  );
                } else if (isSelected) {
                  optionStyle = "border-red-500 bg-red-500/10";
                  iconComponent = <XCircle className="w-5 h-5 text-red-500" />;
                }
              } else if (isSelected) {
                optionStyle = "border-purple-500 bg-purple-500/10";
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  disabled={showExplanation}
                  className={`w-full p-4 rounded-lg border text-left transition-all duration-200 ${optionStyle} flex items-center justify-between`}
                >
                  <span className="text-gray-100">{option.text}</span>
                  {iconComponent}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="mt-8 p-6 rounded-lg bg-gray-800/50 border border-gray-700">
              <p className="text-gray-300">{currentQuestion.explanation}</p>
            </div>
          )}

          {/* Next Button */}
          {showExplanation && (
            <button
              onClick={handleNextQuestion}
              className="mt-8 w-full py-3 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors duration-200 flex items-center justify-center"
            >
              {currentQuestionIndex === questions.length - 1 ? (
                "Terminer le quiz"
              ) : (
                <>
                  Question suivante
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
