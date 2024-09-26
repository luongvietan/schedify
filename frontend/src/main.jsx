import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import WebContextProvider from "./context/Webcontext.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <WebContextProvider>
      <App />
    </WebContextProvider>
  </BrowserRouter>
);
