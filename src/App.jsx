import { useContext } from 'react';
import { Header } from './components/Header'
import { Session } from './components/Session'
import { Timer } from './components/Timer'
import { TimerContext } from './context/TimerContext';
import { ThemeContext } from './context/ThemeContext';
import { SettingsContext } from './context/SettingsContext';
import { Progressbar } from './components/Progressbar';


export default function App() {
  const { theme } = useContext(ThemeContext);
  const { activeButton, isActive } = useContext(TimerContext);
  const { darkTheme } = useContext(SettingsContext);
  const map = {
    1: theme.focus,
    2: theme.short,
    3: theme.long
  }

  return (
    <section className={`focus-app bg-${darkTheme && isActive ? theme.dark : map[activeButton]} min-h-screen p-3 flex flex-col items-center w-100 transition ease duration-1000`} >
      <Header />
      <Progressbar />
      <Timer />
      <Session />
    </section>
  )
}
