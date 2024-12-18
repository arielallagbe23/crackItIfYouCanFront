import React, { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        alert("Connexion réussie !");
        setUsername("");
        setPassword("");
      } else {
        setError("Nom d'utilisateur ou mot de passe incorrect.");
      }
    } catch (err) {
      setError("Impossible de se connecter au serveur.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-gray-300">
      <div className="p-8 bg-gray-900 shadow-lg rounded-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-red-600 mb-6 text-center">
          Connexion
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
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded transition duration-300"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
