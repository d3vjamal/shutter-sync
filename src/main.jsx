import React from "react";
import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const convex = new ConvexReactClient(
  import.meta.env.VITE_CONVEX_URL || "https://dummy-url.convex.cloud",
);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConvexAuthProvider client={convex}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConvexAuthProvider>
  </React.StrictMode>,
);
