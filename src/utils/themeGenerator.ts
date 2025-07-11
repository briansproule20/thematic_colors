import chroma from 'chroma-js';

// Strongly typed theme structure with five-color palette
export interface Theme {
  background: string;
  foreground: string;
  accent: string;
  highlight: string;
  card: string;
}

// Generate a random accessible five-color theme with high-contrast fg/bg
export function generateTheme(): Theme {
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

// Apply theme to CSS custom properties
export function applyThemeToSite(theme: Theme): void {
  const root = document.documentElement;
  root.style.setProperty('--color-background', theme.background);
  root.style.setProperty('--color-foreground', theme.foreground);
  root.style.setProperty('--color-accent', theme.accent);
  root.style.setProperty('--color-highlight', theme.highlight);
  root.style.setProperty('--color-card', theme.card);
}

// Save theme to localStorage
export function saveTheme(theme: Theme): void {
  localStorage.setItem('site-theme', JSON.stringify(theme));
}

// Load theme from localStorage
export function loadTheme(): Theme | null {
  const saved = localStorage.getItem('site-theme');
  return saved ? JSON.parse(saved) : null;
}

// Initialize theme (load saved or generate new)
export function initializeTheme(): Theme {
  const savedTheme = loadTheme();
  const theme = savedTheme || generateTheme();
  applyThemeToSite(theme);
  return theme;
} 