import React from "react";
import { Routes, Route } from "react-router-dom";
import RedesignHeader from "./redesign/components/RedesignHeader";
import Home from "./redesign/pages/Home";
import DashboardPage from "./redesign/pages/Dashboard";
import PhotographersPage from "./redesign/pages/Photographers";

export default function AppRouter() {
  return (
    <>
      <RedesignHeader />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/photographers" element={<PhotographersPage />} />
      </Routes>
    </>
  );
}
