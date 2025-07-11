import { useState } from 'react';
import { ThemeChanger } from './components/ThemeChanger';
import { GetColorfulButton } from './components/GetColorfulButton';
import type { Theme } from './utils/themeGenerator';
import { applyThemeToSite } from './utils/themeGenerator';
import './App.css';

function App() {
  const [currentTheme, setCurrentTheme] = useState<Theme>({
    background: '#ffffff',
    foreground: '#000000',
    accent: '#3b82f6',
    highlight: '#f59e0b',
    card: '#f8fafc'
  });

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme);
    applyThemeToSite(theme);
  };

  return (
    <div 
      className="min-h-screen transition-all duration-300"
      style={{ 
        background: currentTheme.background,
        color: currentTheme.foreground
      }}
    >
      {/* Main Theme Changer Interface */}
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 
            className="text-4xl font-bold mb-4"
            style={{ color: currentTheme.accent }}
          >
            Thematic Colors
          </h1>
          <p 
            className="text-lg"
            style={{ color: currentTheme.foreground }}
          >
            Generate beautiful, accessible color themes using color theory
          </p>
        </header>

        <ThemeChanger onThemeChange={handleThemeChange} />
      </div>

      {/* Floating "Get Colorful" Button for Live Site Integration Demo */}
      <GetColorfulButton />
    </div>
  );
}

export default App;
