import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeDatabase } from './lib/indexeddb'
import { GoogleOAuthProvider } from '@react-oauth/google';

// IndexedDB 초기화
initializeDatabase().then(() => {
  createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  );
}).catch((error) => {
  console.error('Database initialization failed:', error);
  createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  );
});

