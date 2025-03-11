import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/index.tsx";
import PollProvider from "./context/poll.provider.tsx";
import { Toaster } from "sonner";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PollProvider>
      <RouterProvider router={routes} />
      <Toaster />
    </PollProvider>
  </StrictMode>
);
