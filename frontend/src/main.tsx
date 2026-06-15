/**
 * @file main.tsx
 * @description Entry point for the RegIntel-AI frontend application.
 * Mounts the main React application tree inside the DOM root container.
 */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Mount App inside StrictMode into the 'root' DOM node.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

