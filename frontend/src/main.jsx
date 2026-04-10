import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@appwrite.io/pink-icons";
import App from './App.jsx'
import AppWrapper from './AppWrapper.jsx';
import { registerSW } from 'virtual:pwa-register'

registerSW({
  immediate: true,
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
