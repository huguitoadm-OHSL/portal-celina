import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CommercialProvider } from './state/CommercialProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CommercialProvider><App /></CommercialProvider>
  </StrictMode>,
)
