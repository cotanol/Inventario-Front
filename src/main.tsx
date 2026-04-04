import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';

import App from './App.tsx';
import { AuthContextProvider } from './context/auth-context.tsx';
import './index.css';

createRoot(document.getElementById("root")!).render(
  <AuthContextProvider>
    <BrowserRouter>
      <App />
      <Toaster richColors position="top-right" />
    </BrowserRouter>
  </AuthContextProvider>
);
