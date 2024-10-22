import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SettingsProvider } from './context/SettingsContext.jsx'
import { TimerProvider } from './context/TimerContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <SettingsProvider>
        <TimerProvider>
          <App />
        </TimerProvider>
      </SettingsProvider>
    </ThemeProvider>
  </StrictMode>,
)
