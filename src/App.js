import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "./components/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import VenuePage from "./pages/venuepage/VenuePage";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/venue/:id" element={<VenuePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
export default App;
