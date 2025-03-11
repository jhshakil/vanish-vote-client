import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/index.tsx";
import "./index.css";
import PollProvider from "./context/poll.provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PollProvider>
      <RouterProvider router={routes} />
    </PollProvider>
  </StrictMode>
);
