import { useState, useEffect } from 'react';
import { generateTheme, applyThemeToSite, saveTheme, loadTheme, saveToThemeCollection, getThemeCollection, removeFromThemeCollection, isThemeSaved, type Theme, type Mood } from '../utils/themeGenerator';
import { downloadThemePNG } from '../utils/themeExporter';

function getCurrentThemeFromCSSVars(): Theme {
  const root = document.documentElement;
  return {
    background: getComputedStyle(root).getPropertyValue('--color-background').trim() || '#ffffff',
    foreground: getComputedStyle(root).getPropertyValue('--color-foreground').trim() || '#000000',
    accent: getComputedStyle(root).getPropertyValue('--color-accent').trim() || '#3b82f6',
    highlight: getComputedStyle(root).getPropertyValue('--color-highlight').trim() || '#f59e0b',
    card: getComputedStyle(root).getPropertyValue('--color-card').trim() || '#f8fafc',
  };
}

interface ThemeChangerProps {
  onThemeChange: (theme: Theme) => void;
}

export function ThemeChanger({ onThemeChange }: ThemeChangerProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const savedTheme = loadTheme();
    return savedTheme || generateTheme();
  });
  const [savedThemes, setSavedThemes] = useState(getThemeCollection());
  const [showSavedThemes, setShowSavedThemes] = useState(false);
  const [currentMood, setCurrentMood] = useState<Mood>('none');

  // Apply theme to document body
  const applyTheme = (theme: Theme) => {
    applyThemeToSite(theme);
    document.body.style.background = theme.background;
    document.body.style.color = theme.foreground;
  };

  // Initialize with current theme
  useEffect(() => {
    applyTheme(currentTheme);
    onThemeChange(currentTheme);
  }, [currentTheme, onThemeChange]);

  const generateNewPalette = () => {
    const newTheme = generateTheme(currentMood);
    setCurrentTheme(newTheme);
    applyThemeToSite(newTheme);
  };

  const saveCurrentTheme = () => {
    saveToThemeCollection(getCurrentThemeFromCSSVars());
    setSavedThemes(getThemeCollection());
  };

  const loadSavedTheme = (savedTheme: Theme) => {
    setCurrentTheme(savedTheme);
    saveTheme(savedTheme);
  };

  const deleteSavedTheme = (themeId: string) => {
    removeFromThemeCollection(themeId);
    setSavedThemes(getThemeCollection());
  };

  const downloadThemeAsPNG = (theme: Theme, name: string) => {
    downloadThemePNG(theme, name);
  };

  const setMood = (mood: Mood) => {
    setCurrentMood(mood);
  };

  const appliedTheme = getCurrentThemeFromCSSVars();
  const isCurrentThemeSaved = isThemeSaved(appliedTheme);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Mood Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3" style={{ color: 'var(--color-foreground)' }}>
          Choose Your Mood:
        </h3>
        <div className="flex gap-3 justify-center">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              currentMood === 'melancholy' ? 'ring-2 ring-offset-2' : 'hover:scale-105'
            }`}
            style={{ 
              background: currentMood === 'melancholy' ? 'var(--color-accent)' : 'var(--color-card)',
              color: currentMood === 'melancholy' ? 'var(--color-foreground)' : 'var(--color-foreground)',
              border: currentMood === 'melancholy' ? `2px solid var(--color-accent)` : `2px solid var(--color-highlight)`
            }}
            onClick={() => setMood('melancholy')}
          >
            🌊 Melancholy
          </button>
          
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              currentMood === 'euphoric' ? 'ring-2 ring-offset-2' : 'hover:scale-105'
            }`}
            style={{ 
              background: currentMood === 'euphoric' ? 'var(--color-accent)' : 'var(--color-card)',
              color: currentMood === 'euphoric' ? 'var(--color-foreground)' : 'var(--color-foreground)',
              border: currentMood === 'euphoric' ? `2px solid var(--color-accent)` : `2px solid var(--color-highlight)`
            }}
            onClick={() => setMood('euphoric')}
          >
            ✨ Euphoric
          </button>
          
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              currentMood === 'none' ? 'ring-2 ring-offset-2' : 'hover:scale-105'
            }`}
            style={{ 
              background: currentMood === 'none' ? 'var(--color-accent)' : 'var(--color-card)',
              color: currentMood === 'none' ? 'var(--color-foreground)' : 'var(--color-foreground)',
              border: currentMood === 'none' ? `2px solid var(--color-accent)` : `2px solid var(--color-highlight)`
            }}
            onClick={() => setMood('none')}
          >
            🎲 No Mood
          </button>
        </div>
      </div>
      
      {/* Color palette display */}
      <div className="flex gap-4 mb-8">
        <div className="w-20 h-20 rounded shadow-lg border" style={{ background: 'var(--color-background)' }}>
          <div className="text-xs p-1 text-center" style={{ color: 'var(--color-foreground)' }}>BG</div>
        </div>
        <div className="w-20 h-20 rounded shadow-lg" style={{ background: 'var(--color-foreground)' }}>
          <div className="text-xs p-1 text-center" style={{ color: 'var(--color-background)' }}>FG</div>
        </div>
        <div className="w-20 h-20 rounded shadow-lg" style={{ background: 'var(--color-accent)' }}>
          <div className="text-xs p-1 text-center" style={{ color: 'var(--color-foreground)' }}>ACC</div>
        </div>
        <div className="w-20 h-20 rounded shadow-lg" style={{ background: 'var(--color-highlight)' }}>
          <div className="text-xs p-1 text-center" style={{ color: 'var(--color-foreground)' }}>HL</div>
        </div>
        <div className="w-20 h-20 rounded shadow-lg border" style={{ background: 'var(--color-card)' }}>
          <div className="text-xs p-1 text-center" style={{ color: 'var(--color-foreground)' }}>CARD</div>
        </div>
      </div>
      
      {/* Sample card demonstrating all 5 colors */}
      <div className="mb-8 flex gap-8 items-start">
        <div className="w-80 p-6 rounded-xl shadow-xl border" style={{ background: 'var(--color-card) !important', color: 'var(--color-foreground) !important', borderColor: 'var(--color-highlight) !important' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full" style={{ background: 'var(--color-accent) !important' }}></div>
            <h3 className="font-bold text-lg" style={{ color: 'var(--color-accent) !important' }}>Sample Card</h3>
          </div>
          <p className="mb-4" style={{ color: 'var(--color-foreground) !important' }}>
            This is a sample card demonstrating how all five colors work together in a real design. 
            The background uses the card color, text uses foreground, and accents use the highlight color.
          </p>
          <div className="flex gap-2">
            <button 
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
              style={{ 
                background: 'var(--color-accent) !important', 
                color: 'var(--color-foreground) !important' 
              }}
            >
              Primary Action
            </button>
            <button 
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-all hover:scale-105"
              style={{ 
                background: 'transparent !important', 
                color: 'var(--color-accent) !important',
                borderColor: 'var(--color-accent) !important'
              }}
            >
              Secondary
            </button>
          </div>
        </div>
        
        <div className="w-80 p-6 rounded-xl shadow-xl" style={{ background: 'var(--color-highlight) !important', color: 'var(--color-foreground) !important' }}>
          <h3 className="font-bold text-lg mb-4" style={{ color: 'var(--color-foreground) !important' }}>Color Usage Guide</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-semibold" style={{ color: 'var(--color-accent) !important' }}>Background:</span>
              <span className="ml-2" style={{ color: 'var(--color-foreground) !important' }}>Page background</span>
            </div>
            <div>
              <span className="font-semibold" style={{ color: 'var(--color-accent) !important' }}>Foreground:</span>
              <span className="ml-2" style={{ color: 'var(--color-foreground) !important' }}>Primary text color</span>
            </div>
            <div>
              <span className="font-semibold" style={{ color: 'var(--color-accent) !important' }}>Accent:</span>
              <span className="ml-2" style={{ color: 'var(--color-foreground) !important' }}>Brand color, buttons, links</span>
            </div>
            <div>
              <span className="font-semibold" style={{ color: 'var(--color-accent) !important' }}>Highlight:</span>
              <span className="ml-2" style={{ color: 'var(--color-foreground) !important' }}>Secondary elements, info boxes</span>
            </div>
            <div>
              <span className="font-semibold" style={{ color: 'var(--color-accent) !important' }}>Card:</span>
              <span className="ml-2" style={{ color: 'var(--color-foreground) !important' }}>Card backgrounds, elevated surfaces</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 mb-8">
        <button
          className="px-6 py-3 rounded font-semibold shadow-lg transition-all duration-300 hover:scale-105"
          style={{ 
            background: 'var(--color-highlight)', 
            color: 'var(--color-foreground)' 
          }}
          onClick={generateNewPalette}
        >
          Generate New Palette
        </button>
        
        <button
          className={`px-6 py-3 rounded font-semibold shadow-lg transition-all duration-300 hover:scale-105 ${
            isCurrentThemeSaved ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
          }`}
          style={{ 
            background: 'var(--color-accent)', 
            color: 'var(--color-foreground)' 
          }}
          onClick={saveCurrentTheme}
          disabled={isCurrentThemeSaved}
        >
          {isCurrentThemeSaved ? '✓ Saved' : 'Save to My Themes'}
        </button>

        <button
          className="px-4 py-3 rounded font-semibold shadow-lg transition-all duration-300 hover:scale-105"
          style={{ 
            background: 'var(--color-card)', 
            color: 'var(--color-foreground)',
            border: `2px solid var(--color-accent)`
          }}
          onClick={() => setShowSavedThemes(!showSavedThemes)}
        >
          {showSavedThemes ? 'Hide' : 'Show'} Saved Themes ({savedThemes.length})
        </button>
      </div>
      
      {/* Saved Themes Section */}
      {showSavedThemes && (
        <div className="mb-8 p-6 rounded-xl shadow-xl" style={{ background: 'var(--color-card)' }}>
          <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-accent)' }}>
            My Saved Themes
          </h3>
          {savedThemes.length === 0 ? (
            <p style={{ color: 'var(--color-foreground)' }}>No saved themes yet. Generate and save some themes!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedThemes.map((savedTheme) => (
                <div 
                  key={savedTheme.id} 
                  className="p-4 rounded-lg border transition-all hover:scale-105"
                  style={{ 
                    background: savedTheme.background,
                    borderColor: savedTheme.accent
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold" style={{ color: savedTheme.foreground }}>
                      {savedTheme.name}
                    </h4>
                    <button
                      className="text-xs px-2 py-1 rounded hover:bg-red-500 hover:text-white transition-colors"
                      style={{ color: savedTheme.accent }}
                      onClick={() => deleteSavedTheme(savedTheme.id)}
                    >
                      ×
                    </button>
                  </div>
                  
                  {/* Mini color palette */}
                  <div className="flex gap-1 mb-3">
                    <div className="w-4 h-4 rounded" style={{ background: savedTheme.background }}></div>
                    <div className="w-4 h-4 rounded" style={{ background: savedTheme.foreground }}></div>
                    <div className="w-4 h-4 rounded" style={{ background: savedTheme.accent }}></div>
                    <div className="w-4 h-4 rounded" style={{ background: savedTheme.highlight }}></div>
                    <div className="w-4 h-4 rounded" style={{ background: savedTheme.card }}></div>
                  </div>
                  
                  <button
                    className="w-full px-3 py-2 text-sm rounded font-medium transition-all hover:scale-105"
                    style={{ 
                      background: savedTheme.accent, 
                      color: savedTheme.foreground 
                    }}
                    onClick={() => loadSavedTheme(savedTheme)}
                  >
                    Load Theme
                  </button>
                  
                  <button
                    className="w-full mt-2 px-3 py-2 text-sm rounded font-medium transition-all hover:scale-105"
                    style={{ 
                      background: savedTheme.highlight, 
                      color: savedTheme.foreground 
                    }}
                    onClick={() => downloadThemeAsPNG(savedTheme, savedTheme.name)}
                  >
                    📷 Download PNG
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Preview indicator */}
      {/* Removed preview indicator as it's no longer relevant */}
      
      {/* Theme information */}
      <div className="mt-8 p-6 rounded-lg shadow-lg" style={{ background: 'var(--color-card)' }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-accent)' }}>
          Current Theme
        </h2>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="font-mono text-black">Background:</span>
            <span className="font-mono text-black">{appliedTheme.background}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-black">Foreground:</span>
            <span className="font-mono text-black">{appliedTheme.foreground}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-black">Accent:</span>
            <span className="font-mono text-black">{appliedTheme.accent}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-black">Highlight:</span>
            <span className="font-mono text-black">{appliedTheme.highlight}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-black">Card:</span>
            <span className="font-mono text-black">{appliedTheme.card}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 