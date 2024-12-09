import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("utilisateur");
    setIsLoggedIn(false);
    navigate("/connexion");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-black dark:bg-gray-900 text-gray-300 shadow-lg border-b border-gray-700">
      {/* Titre principal */}
        <h1
            className="text-8xl font-extrabold tracking-wide glow-text animate-flicker"
            >
            <span>C I I Y C</span>
        </h1>




      {/* Navigation */}
      <div className="flex items-center gap-6">
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-gray-200 px-6 py-2 rounded-full hover:bg-red-700 transition-all duration-300"
          >
            Déconnexion
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/connexion"
              className="text-gray-300 border border-gray-500 px-5 py-2 rounded-full hover:text-red-500 hover:border-red-500 transition-all duration-300"
            >
              Connexion
            </Link>
            <Link
              to="/inscription"
              className="text-gray-300 border border-gray-500 px-5 py-2 rounded-full hover:text-red-500 hover:border-red-500 transition-all duration-300"
            >
              Inscription
            </Link>
          </div>
        )}

        {/* Bouton pour basculer entre les thèmes */}
        <div
          className="w-16 h-8 flex items-center bg-gray-600 dark:bg-gray-800 rounded-full p-1 cursor-pointer"
          onClick={toggleDarkMode}
        >
          <div
            className={`bg-red-600 w-6 h-6 rounded-full shadow-lg transform transition-transform duration-500 ${
              isDarkMode ? "translate-x-8" : "translate-x-0"
            }`}
          ></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
