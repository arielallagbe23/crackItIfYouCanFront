import React, { useState } from "react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Regex pour valider le mot de passe
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!passwordRegex.test(password)) {
      setError(
        "Mot de passe invalide : minimum 8 caractères, une majuscule, un chiffre et un caractère spécial."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas !");
      return;
    }

    setError("");

    // Appel API fictif pour l'inscription
    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setSuccess("Inscription réussie !");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
      } else {
        const result = await response.json();
        setError(result.message || "Une erreur est survenue.");
      }
    } catch (err) {
      setError("Connexion au serveur échouée.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-gray-300">
      <div className="p-8 bg-gray-900 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">
          Inscription
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2 bg-gray-800 text-gray-300 rounded border border-gray-700 focus:outline-none focus:border-red-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 bg-gray-800 text-gray-300 rounded border border-gray-700 focus:outline-none focus:border-red-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-2 bg-gray-800 text-gray-300 rounded border border-gray-700 focus:outline-none focus:border-red-600"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded transition duration-300"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
