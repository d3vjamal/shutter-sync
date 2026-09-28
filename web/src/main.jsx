import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./hooks/useTheme";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl || convexUrl === "https://dummy-url.convex.cloud") {
  console.warn(
    "⚠️ VITE_CONVEX_URL not set or is using dummy URL. Please configure your Convex deployment URL in .env.local",
    { convexUrl },
  );
} else {
  console.log("✅ Convex URL configured:", convexUrl);
}

const convex = new ConvexReactClient(
  convexUrl || "https://dummy-url.convex.cloud",
);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConvexAuthProvider client={convex}>
      <BrowserRouter>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </BrowserRouter>
    </ConvexAuthProvider>
  </React.StrictMode>,
);
