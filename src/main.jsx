import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import "@xyflow/react/dist/style.css";
import "./theme.css";
import "./styles/booth.css";
import "./styles/architecture-v2.css";
import "./styles/platform-stack.css";
import "./styles/explorer.css";
import "./styles/component-page.css";
import "./styles/shell.css";
import "./styles/light-theme.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
