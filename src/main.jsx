import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { handleRecoveryRedirect } from './auth/handleRecoveryRedirect.js'

// Must resolve before the router mounts and reads location.hash - see the
// comment in handleRecoveryRedirect.js for why.
await handleRecoveryRedirect()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
