import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SettingsProvider } from './components/context/SettingsContext.jsx'
import { TimerProvider } from './components/context/TimerContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SettingsProvider>
      <TimerProvider>
        <App />
      </TimerProvider>
    </SettingsProvider>
  </StrictMode>,
)
