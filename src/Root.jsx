import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "./ChathGenerator/App";
import VoicePrompt from "./VoicePrompt/voicePrompt";
import ImageGenerator from "./ImageGenerator/ImageGenerator";

const Root = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/voicePrompt" element={<VoicePrompt />} />
        <Route path="/imageGenerator" element={<ImageGenerator />} />
      </Routes>
    </div>
  );
};

export default Root;
