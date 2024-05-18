import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Layout from "./components/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import VenuePage from "./pages/venuepage/VenuePage";
import MyProfile from "./pages/myprofile/MyProfile";
import ManageVenues from "./pages/managevenues/ManageVenues";
import "./App.css";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/venue/:id" element={<VenuePage />} />
          <Route path="/profile" element={<MyProfile />} />
          <Route path="/venuemanager" element={<ManageVenues />} />
        </Routes>
      </Layout>
    </Router>
  );
}
export default App;
