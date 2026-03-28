import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import UserContext from "./contexts/UserContext.jsx";
import CaptainContext from "./contexts/CaptainContext.jsx";
import SocketContext from "./contexts/SocketContext.jsx";
import { AdminContextProvider } from "./contexts/AdminContext.jsx";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <SocketContext>
      <UserContext>
        <CaptainContext>
          <AdminContextProvider>
            <App />
          </AdminContextProvider>
        </CaptainContext>
      </UserContext>
    </SocketContext>
  // </StrictMode>
);
