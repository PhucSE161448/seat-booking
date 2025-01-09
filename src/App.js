import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home/home";
import Login from "./login/login";
import Home1 from "./home1/home1";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/concert-dot-2" element={<Home1 />} />
        <Route path="/concert-dot-1" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
