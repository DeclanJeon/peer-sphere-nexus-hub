import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeDatabase } from './lib/indexeddb'

// IndexedDB 초기화
initializeDatabase().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
}).catch((error) => {
  console.error('Database initialization failed:', error);
  createRoot(document.getElementById("root")!).render(<App />);
});
