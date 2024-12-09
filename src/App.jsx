import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Register from "./components/register";
import Login from "./components/login";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/inscription" element={<Register />} />
        <Route path="/connexion" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
