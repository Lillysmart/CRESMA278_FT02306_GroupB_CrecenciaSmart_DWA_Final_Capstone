import React from "react";
import { Routes, Route } from "react-router-dom";
import { ShowPreview } from "./Components/Preview";
import { ShowDetail } from "./Components/ShowDetails";
import '@shoelace-style/shoelace/dist/shoelace.css';


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ShowPreview />} />
        <Route path="/id/:id" element={<ShowDetail />} />
      </Routes>
    </div>
  );
};

export default App;
