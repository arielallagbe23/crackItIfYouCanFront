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

    // Appel API pour l'inscription
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
            <label className="block text-sm font-medium mb-2">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-700 rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-700 rounded"
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
              className="w-full p-2 border border-gray-700 rounded"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <button
            type="submit"
            className="w-full bg-red-600 text-white p-2 rounded mt-4"
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
