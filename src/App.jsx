import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BibleViewer from "./BibleViewer";
import RootLayout from "./layouts/RootLayout";
import ReadPage from "./pages/ReadPage";
import SettingsPage from "./pages/SettingsPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<ReadPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
