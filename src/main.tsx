// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import AppWrapper from "./app-wrapper";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>
  <AppWrapper />,
);
