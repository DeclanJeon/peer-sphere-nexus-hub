import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeDatabase } from './lib/indexeddb'
import { GoogleOAuthProvider } from '@react-oauth/google';

const rootElement = document.getElementById("root");

const renderApp = () => {
  createRoot(rootElement!).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  );
};

initializeDatabase()
  .then(() => {
    console.log("Database initialized successfully.");
    renderApp();
  })
  .catch((error) => {
    console.error("Database initialization failed:", error);
    renderApp();
  });

