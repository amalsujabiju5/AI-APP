import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Root from "./Root";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Root />
    </BrowserRouter>
  </StrictMode>
);
