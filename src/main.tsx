import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/global.scss';
import { AuthProvider } from './contexts/AuthContext.tsx';

/* import ParticleTest from './components/ParticulesTest.tsx';
import ParticulesComponent from './components/ParticulesComponent.tsx'; */

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    {/* <ParticulesComponent /> */}
        <App />
    </AuthProvider>
  </StrictMode>,
)
