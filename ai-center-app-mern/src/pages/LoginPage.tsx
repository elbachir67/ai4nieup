import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../config/api";
import { Lock, Eye, EyeOff } from "lucide-react";

function LoginPage() {
  const navigate = useNavigate();
  const { signIn, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // Si l'utilisateur est déjà connecté, rediriger
    if (isAuthenticated) {
      const redirectUrl = localStorage.getItem("redirectAfterLogin") || "/";
      localStorage.removeItem("redirectAfterLogin"); // Nettoyer après utilisation
      navigate(redirectUrl);
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(api.auth.login, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Erreur de connexion");
      }

      const data = await response.json();
      if (data.success) {
        await signIn(email, password);

        // La redirection sera gérée par le useEffect
      } else {
        throw new Error(data.message || "Erreur de connexion");
      }
    } catch (error) {
      toast.error("Erreur de connexion");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-xl">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
            <Lock className="h-6 w-6 text-purple-400" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-100">
            Connexion
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Ou{" "}
            <button
              onClick={() => navigate("/register")}
              className="font-medium text-purple-400 hover:text-purple-300"
            >
              créez un compte
            </button>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Adresse email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-700 bg-gray-800 placeholder-gray-500 text-gray-100 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm pr-10"
                placeholder="Mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
