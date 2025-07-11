import { useState, useEffect } from 'react';
import chroma, { type Color } from 'chroma-js';

// Strongly typed theme structure with five-color palette
interface Theme {
  background: string;
  foreground: string;
  accent: string;
  highlight: string;
  card: string;
}

// Generate a random accessible five-color theme with high-contrast fg/bg
function generateTheme(): Theme {
  // Randomly decide if background is light or dark
  const isLightMode = Math.random() < 0.5;
  // Pick a random hue for the base color
  const baseHue = Math.floor(Math.random() * 360);

  // Generate a background color in the chosen range
  const background = chroma.hsl(
    baseHue,
    0.12 + Math.random() * 0.12, // low saturation for backgrounds
    isLightMode ? 0.92 + Math.random() * 0.06 : 0.08 + Math.random() * 0.10 // very light or very dark
  ).hex();

  // Try to find a foreground color with high contrast
  let foreground: string = '';
  let attempts = 0;
  while (attempts < 10) {
    // For light bg, try dark fg; for dark bg, try light fg
    const fgLum = isLightMode
      ? 0.08 + Math.random() * 0.10 // dark
      : 0.92 + Math.random() * 0.06; // light
    const fgSat = 0.10 + Math.random() * 0.15;
    const fg = chroma.hsl(baseHue, fgSat, fgLum).hex();
    if (chroma.contrast(background, fg) >= 7) {
      foreground = fg;
      break;
    }
    attempts++;
  }
  // Fallback to black/white if not found
  if (!foreground) {
    foreground = isLightMode ? '#181818' : '#fafafa';
  }

  // Accent and highlight: can be ANY color, but must complement each other
  const accentHue = Math.floor(Math.random() * 360);
  const accent = chroma.hsl(accentHue, 0.65, isLightMode ? 0.45 : 0.55).hex();
  
  // Highlight: choose from complementary, triadic, or analogous to accent
  const accentComplement = (accentHue + 180) % 360;
  const accentTriadic1 = (accentHue + 120) % 360;
  const accentTriadic2 = (accentHue + 240) % 360;
  const accentAnalogous1 = (accentHue + 30) % 360;
  const accentAnalogous2 = (accentHue - 30 + 360) % 360;
  
  const highlightOptions = [accentComplement, accentTriadic1, accentTriadic2, accentAnalogous1, accentAnalogous2];
  const highlightHue = highlightOptions[Math.floor(Math.random() * highlightOptions.length)];
  const highlight = chroma.hsl(highlightHue, 0.55, isLightMode ? 0.60 : 0.40).hex();
  // Card: more differentiated from background for elevation, but harmonious
  const bgHSL = chroma(background).hsl();
  let cardL = isLightMode ? bgHSL[2] - 0.13 : bgHSL[2] + 0.13;
  cardL = Math.max(0, Math.min(1, cardL)); // clamp to [0,1]
  const card = chroma.hsl(bgHSL[0], bgHSL[1], cardL).hex();

  return { background, foreground, accent, highlight, card };
}

function App() {
  const [currentTheme, setCurrentTheme] = useState<Theme>(generateTheme());
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);

  // Apply theme to document body
  const applyTheme = (theme: Theme) => {
    document.body.style.background = theme.background;
    document.body.style.color = theme.foreground;
  };

  // Initialize with current theme
  useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme]);

  const generateNewPalette = () => {
    setPreviewTheme(generateTheme());
  };

  const applyPreview = () => {
    if (previewTheme) {
      setCurrentTheme(previewTheme);
      applyTheme(previewTheme);
      setPreviewTheme(null);
    }
  };

  const activeTheme = previewTheme || currentTheme;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center transition-colors duration-500" style={{ background: activeTheme.background }}>
      <h1 className="text-4xl font-bold mb-6" style={{ color: activeTheme.accent }}>
        Thematic Colors
      </h1>
      
      {/* Color palette display */}
      <div className="flex gap-4 mb-8">
        <div className="w-20 h-20 rounded shadow-lg border" style={{ background: activeTheme.background }}>
          <div className="text-xs p-1 text-center text-black">BG</div>
        </div>
        <div className="w-20 h-20 rounded shadow-lg" style={{ background: activeTheme.foreground }}>
          <div className="text-xs p-1 text-center" style={{ color: activeTheme.background }}>FG</div>
        </div>
        <div className="w-20 h-20 rounded shadow-lg" style={{ background: activeTheme.accent }}>
          <div className="text-xs p-1 text-center text-black">ACC</div>
        </div>
        <div className="w-20 h-20 rounded shadow-lg" style={{ background: activeTheme.highlight }}>
          <div className="text-xs p-1 text-center text-black">HL</div>
        </div>
        <div className="w-20 h-20 rounded shadow-lg border" style={{ background: activeTheme.card }}>
          <div className="text-xs p-1 text-center text-black">CARD</div>
        </div>
      </div>
      
      {/* Sample card demonstrating all 5 colors */}
      <div className="mb-8 flex gap-8 items-start">
        <div className="w-80 p-6 rounded-xl shadow-xl border" style={{ background: activeTheme.card }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full" style={{ background: activeTheme.accent }}></div>
            <h3 className="font-bold text-lg" style={{ color: activeTheme.accent }}>Sample Card</h3>
          </div>
          <p className="mb-4" style={{ color: activeTheme.foreground }}>
            This is a sample card demonstrating how all five colors work together in a real design. 
            The background uses the card color, text uses foreground, and accents use the highlight color.
          </p>
          <div className="flex gap-2">
            <button 
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
              style={{ 
                background: activeTheme.accent, 
                color: activeTheme.foreground 
              }}
            >
              Primary Action
            </button>
            <button 
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-all hover:scale-105"
              style={{ 
                background: 'transparent', 
                color: activeTheme.accent,
                borderColor: activeTheme.accent
              }}
            >
              Secondary
            </button>
          </div>
        </div>
        
        <div className="w-80 p-6 rounded-xl shadow-xl" style={{ background: activeTheme.highlight }}>
          <h3 className="font-bold text-lg mb-4" style={{ color: activeTheme.foreground }}>Color Usage Guide</h3>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-semibold" style={{ color: activeTheme.accent }}>Background:</span>
              <span className="ml-2" style={{ color: activeTheme.foreground }}>Page background</span>
            </div>
            <div>
              <span className="font-semibold" style={{ color: activeTheme.accent }}>Foreground:</span>
              <span className="ml-2" style={{ color: activeTheme.foreground }}>Primary text color</span>
            </div>
            <div>
              <span className="font-semibold" style={{ color: activeTheme.accent }}>Accent:</span>
              <span className="ml-2" style={{ color: activeTheme.foreground }}>Brand color, buttons, links</span>
            </div>
            <div>
              <span className="font-semibold" style={{ color: activeTheme.accent }}>Highlight:</span>
              <span className="ml-2" style={{ color: activeTheme.foreground }}>Secondary elements, info boxes</span>
            </div>
            <div>
              <span className="font-semibold" style={{ color: activeTheme.accent }}>Card:</span>
              <span className="ml-2" style={{ color: activeTheme.foreground }}>Card backgrounds, elevated surfaces</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex gap-4 mb-8">
        <button
          className="px-6 py-3 rounded font-semibold shadow-lg transition-all duration-300 hover:scale-105"
          style={{ 
            background: activeTheme.highlight, 
            color: activeTheme.foreground 
          }}
          onClick={generateNewPalette}
        >
          Generate New Palette
        </button>
        
        {previewTheme && (
          <button
            className="px-6 py-3 rounded font-semibold shadow-lg transition-all duration-300 hover:scale-105"
            style={{ 
              background: activeTheme.accent, 
              color: activeTheme.foreground 
            }}
            onClick={applyPreview}
          >
            Apply Theme
          </button>
        )}
      </div>
      
      {/* Preview indicator */}
      {previewTheme && (
        <div className="mb-4 px-4 py-2 rounded-lg" style={{ background: activeTheme.card }}>
          <span className="text-sm font-semibold" style={{ color: activeTheme.accent }}>
            🎨 Preview Mode - Click "Apply Theme" to use this palette
          </span>
        </div>
      )}
      
      {/* Theme information */}
      <div className="mt-8 p-6 rounded-lg shadow-lg" style={{ background: activeTheme.card }}>
        <h2 className="text-xl font-semibold mb-4" style={{ color: activeTheme.accent }}>
          {previewTheme ? 'Preview Theme' : 'Current Theme'}
        </h2>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex justify-between">
            <span className="font-mono text-black">Background:</span>
            <span className="font-mono text-black">{activeTheme.background}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-black">Foreground:</span>
            <span className="font-mono text-black">{activeTheme.foreground}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-black">Accent:</span>
            <span className="font-mono text-black">{activeTheme.accent}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-black">Highlight:</span>
            <span className="font-mono text-black">{activeTheme.highlight}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-mono text-black">Card:</span>
            <span className="font-mono text-black">{activeTheme.card}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
